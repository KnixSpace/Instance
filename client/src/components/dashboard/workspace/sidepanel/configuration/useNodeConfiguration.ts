import { useAppSelector } from "@/lib/hooks";
import { ActionConfig } from "@/types/configurationTypes";
import { useEffect, useState } from "react";
import { actionConfig } from "../../constant";
import { Node } from "@xyflow/react";
import axios from "axios";

export const useNodeConfiguration = (selectedNode: Node) => {
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: { label: string; value: string }[] | undefined;
  }>({});

  const [previousNodesOptions, setPreviousNodesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const adjacencyList = useAppSelector((state) => state.workflow.adjacencyList);
  const nodes = useAppSelector((state) => state.workflow.nodes);

  const nodeConfig: ActionConfig | undefined = actionConfig.find(
    (config: ActionConfig) => config.action === selectedNode.data.action
  );

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
      nodeConfig.configFields.forEach(async (field) => {
        if (field.isDynamic) {
          try {
            const response = await axios.post(
              field.dynamicOptions?.url || "",
              {
                userId:"671f79f92e1c600ff209857f",
                events:["push","pull_request","issues"],
              }
            );
            console.log(response.data);
            setDynamicOptions((prev) => ({
              ...prev,
              [field.name]: response.data,
            }));
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
      });
    };

    fetchDynamicOptions();
  }, [nodeConfig, previousNodesOptions]);

  return { nodeConfig, dynamicOptions };
};