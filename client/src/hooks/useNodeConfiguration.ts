import { useAppSelector } from "@/lib/hooks";
import {
  ActionConfig,
  ConfigField,
  DynamicOptionsState,
} from "@/types/configurationTypes";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Node } from "@/types/workflowTypes";
import { getPreviousNodes } from "@/utils/workflowUtils";
import { usePreviousValue } from "@/hooks/usePreviousValue";
import { fetchDynamicFieldOptions } from "@/services/dynamicOptions";
import { actionConfig } from "@/components/dashboard/workspace/constant";

interface Options {
  label: string;
  value: string;
}

export const useNodeConfiguration = (
  selectedNode: Node,
  nodeConfig: ActionConfig,
  watch: any
) => {
  const [dynamicOptions, setDynamicOptions] = useState<DynamicOptionsState>({});
  const [previousNodesOptions, setPreviousNodesOptions] = useState<Options[]>(
    []
  );

  useEffect(() => {
    setDynamicOptions({});
    console.log("reset dynamic options");
  }, [selectedNode.id]);

  const backwardList = useAppSelector((state) => state.workflow.backwardList);
  const nodes = useAppSelector((state) => state.workflow.nodes);

  const previousNodes = useMemo(() => {
    return getPreviousNodes(backwardList, selectedNode.id);
  }, [backwardList, selectedNode.id]);

  const dependentFields: string[] = useMemo(() => {
    return (
      nodeConfig.configFields
        .filter(
          (field) =>
            field.isDynamic &&
            field.dependentOn &&
            field.dependentOn?.length > 0
        )
        .flatMap((field) => field.dependentOn || []) || []
    );
  }, [nodeConfig]);
  // console.log("dependentFields", dependentFields);

  const watchedValues = watch(dependentFields).reduce(
    (acc: { [key: string]: any }, option: any, index: any) => {
      if (option) {
        acc[dependentFields[index]] = option.value;
        return acc;
      }
    },
    {} as Record<string, any>
  );
  // console.log("watchedValues", watchedValues);

  const previousWatchedValues = usePreviousValue(watchedValues);
  // console.log("previousWatchedValues", previousWatchedValues);

  const updateDynamicOptions = useCallback(
    async (field: ConfigField, params?: Record<string, any>) => {
      try {
        const options = await fetchDynamicFieldOptions(
          field,
          selectedNode.data.authAccountInfo._id,
          params
        );

        setDynamicOptions((prev) => ({
          ...prev,
          [field.name]: options,
        }));
      } catch (error) {
        console.error(
          `Error fetching dynamic options for ${field.name}`,
          error
        );
      }
    },
    [selectedNode.data.authAccountInfo._id]
  );

  const haveDependenciesChanged = (field: ConfigField, currentValues: any) => {
    if (!field.dependentOn?.length) return false;

    return field.dependentOn.some((dependency) => {
      if (previousWatchedValues === undefined) return true;
      if (previousWatchedValues[dependency] !== currentValues[dependency]) {
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    const options = previousNodes.map((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      const nodeOutput = actionConfig.find(
        (config) => config.action === node?.data.action
      )?.outputFields;

      return (
        nodeOutput?.map((field) => ({
          label: field,
          value: `{{${nodeId}.${field}}}`,
        })) || []
      );
    });

    setPreviousNodesOptions(options.flat());
  }, [previousNodes, nodes, actionConfig]);

  useEffect(() => {
    if (!nodeConfig) return;

    const nonDependentFields = nodeConfig.configFields.filter(
      (field) => !field.dependentOn?.length
    );

    for (const field of nonDependentFields) {
      if (field.type === "select" || field.type === "multi-select") {
        if (field.isDynamic) {
          updateDynamicOptions(field);
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
    }
  }, [nodeConfig, previousNodesOptions, updateDynamicOptions, selectedNode.id]);

  useEffect(() => {
    if (!nodeConfig || !watchedValues) return;
    if (watchedValues) {
      if (Object.keys(watchedValues).length === 0) {
        return;
      }
    }

    const dependentFields = nodeConfig.configFields.filter(
      (field) =>
        field.isDynamic && field.dependentOn && field.dependentOn?.length > 0
    );

    dependentFields.forEach((field) => {
      const hasDependencieSet = field.dependentOn?.every(
        (dependency) => watchedValues[dependency]
      );

      if (hasDependencieSet && haveDependenciesChanged(field, watchedValues)) {
        const params = field.dependentOn?.reduce((acc, dependency) => {
          acc[dependency] = watchedValues[dependency];
          return acc;
        }, {} as Record<string, any>);

        updateDynamicOptions(field, params);
      }
    });
  }, [watchedValues]);

  return { dynamicOptions };
};
