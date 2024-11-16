import { useAppSelector } from "@/lib/hooks";
import { ActionConfig, ConfigField } from "@/types/configurationTypes";
import { useEffect, useRef, useState } from "react";
import { actionConfig } from "../../constant";
import axios from "axios";
import { Node } from "@/types/workflowTypes";

interface Options {
  label: string;
  value: string;
}

export const useNodeConfiguration = (
  selectedNode: Node,
  nodeConfig: ActionConfig,
  watch: any
) => {
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: Options[] | undefined;
  }>({});

  const [previousNodesOptions, setPreviousNodesOptions] = useState<Options[]>(
    []
  );

  const previousDependencyValues = useRef<{ [key: string]: any }>({});

  const adjacencyList = useAppSelector((state) => state.workflow.adjacencyList);
  const nodes = useAppSelector((state) => state.workflow.nodes);

  const haveDependenciesChanged = (field: ConfigField, currentValues: any) => {
    if (!field.dependentOn?.length) return false;

    return field.dependentOn.some((dependency) => {
      if (
        previousDependencyValues.current[dependency] !==
        currentValues[dependency]
      ) {
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    const getPreviousNodes = () => {
      const previousNodeSet = new Set<string>();
      const stack = [selectedNode.id];
      while (stack.length) {
        const currentNodeId = stack.pop();
        for (const node of adjacencyList[currentNodeId as string]) {
          if (!previousNodeSet.has(node)) {
            previousNodeSet.add(node);
            stack.push(node);
          }
        }
      }
      return Array.from(previousNodeSet);
    };

    const previousNodes = getPreviousNodes();
    const options = previousNodes.map((nodeId) => {
      const node = nodes.find((node) => node.id === nodeId);
      const nodeOutput = actionConfig.find(
        (config) => config.action === node?.data.action
      )?.outputFields;

      return nodeOutput
        ? nodeOutput.map((field) => ({
            label: field,
            value: `{{${nodeId}.${field}}}`,
          }))
        : [];
    });

    setPreviousNodesOptions(options.flat());
  }, [selectedNode, adjacencyList, nodes]);

  useEffect(() => {
    if (!nodeConfig) return;

    const fetchDynamicOptions = async () => {
      const nonDependentFields = nodeConfig.configFields.filter(
        (filed) => !filed.dependentOn?.length
      );

      for (const field of nonDependentFields) {
        if (field.isDynamic) {
          try {
            const response = await axios.post(
              field.dynamicOptions?.url || "",
              {
                accountId: selectedNode.data.authAccountInfo._id,
                ...field.dynamicOptions?.body,
              },
              { withCredentials: true }
            );
            if (response.status === 200) {
              setDynamicOptions((prev) => ({
                ...prev,
                [field.name]: response.data.options,
              }));
            }
          } catch (error) {
            console.error(
              `Error fetching dynamic options for ${field.name}`,
              error
            );
          }
        } else if (field.options) {
          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: field.options,
          }));
        } else {
          setDynamicOptions((prev) => ({
            ...prev,
            [field.name]: previousNodesOptions,
          }));
        }
      }
    };

    fetchDynamicOptions();
  }, [previousNodesOptions]);

  const dependentFields = nodeConfig.configFields
    .filter(
      (field) =>
        field.isDynamic && field.dependentOn && field.dependentOn?.length > 0
    )
    .flatMap((field) => field.dependentOn || []);

  const watchedValues = watch(dependentFields).reduce(
    (acc: { [key: string]: any }, option: any, index: any) => {
      if (option) {
        acc[dependentFields[index]] = option.value;
        return acc;
      }
    },
    {} as Record<string, any>
  );

  useEffect(() => {
    if (!nodeConfig || !watchedValues) return;

    const fetchDependentOptions = async () => {
      const dependentFields = nodeConfig.configFields.filter(
        (field) =>
          field.isDynamic && field.dependentOn && field.dependentOn?.length > 0
      );

      for (const field of dependentFields) {
        const hasDependencieSet = field.dependentOn?.every(
          (dependency) => watchedValues[dependency]
        );

        if (
          hasDependencieSet &&
          haveDependenciesChanged(field, watchedValues)
        ) {
          try {
            const response = await axios.post(
              field.dynamicOptions?.url || "",
              {
                accountId: selectedNode.data.authAccountInfo._id,
                ...field.dynamicOptions?.body,
                ...field.dependentOn?.reduce((acc, dependency) => {
                  acc[dependency] = watchedValues[dependency];
                  return acc;
                }, {} as Record<string, any>),
              },
              { withCredentials: true }
            );

            if (response.status === 200) {
              console.log("response", response.data.options);
              setDynamicOptions((prev) => ({
                ...prev,
                [field.name]: response.data.options,
              }));
            }
          } catch (error) {
            console.error(
              `Error fetching dynamic options for ${field.name}`,
              error
            );
          }
        }
      }
      previousDependencyValues.current = { ...watchedValues };
    };

    fetchDependentOptions();
  }, [watchedValues]);

  return { dynamicOptions };
};
