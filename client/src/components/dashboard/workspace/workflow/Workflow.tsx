"use client";

import {
  addEdge,
  Background,
  Controls,
  Edge,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import TriggerNode from "./customNodes/TriggerNode";
import ActionNode from "./customNodes/ActionNode";

import { useCallback, useEffect } from "react";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addNewEdge,
  addNewNode,
  initializedNewWorkflow,
  selectNode,
  setAdjacencyList,
  setDeletedNodes,
  setWarning,
} from "@/lib/features/workflow/workflowSlice";
import { Node } from "@/types/workflowTypes";
import { getNextNodes } from "@/utils/workflowUtils";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type Props = {};
const Workflow = (props: Props) => {
  const flow = useAppSelector((state) => state.workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(flow.edges);

  const { screenToFlowPosition } = useReactFlow();
  const dispatch = useAppDispatch();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    dispatch(addNewEdge(edges));
    dispatch(setAdjacencyList());
  }, [edges, nodes, dispatch]);

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeData = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    const { type, data } = nodeData;

    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: v4(),
      type,
      position,
      data,
      selected: true,
    };

    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) => ({
        ...node,
        selected: false,
      }));
      return [...updatedNodes, newNode];
    });

    dispatch(addNewNode(newNode));
    dispatch(selectNode(newNode.id));
  };

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch(selectNode(node.id));
    },
    [dispatch]
  );

  const handlePaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      const updatedEdges = edges.filter((edge) => !deletedEdges.includes(edge));
      dispatch(addNewEdge(updatedEdges));
    },
    [edges, dispatch]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      const triggerNodeDeleted = deletedNodes.some(
        (node) => node.type === "trigger"
      );

      if (triggerNodeDeleted) {
        setNodes([]);
        setEdges([]);
        dispatch(initializedNewWorkflow());
        return;
      }

      const deletedDecendants = deletedNodes.flatMap((node) => {
        return getNextNodes(flow.forwardList, node.id, true);
      });

      dispatch(setDeletedNodes(deletedDecendants));
      setNodes((prevNodes) => {
        return prevNodes.filter((node) => !deletedDecendants.includes(node.id));
      });
      setEdges((prevEdges) => {
        return prevEdges.filter(
          (edge) =>
            !deletedDecendants.includes(edge.source) &&
            !deletedDecendants.includes(edge.target)
        );
      });
      dispatch(addNewEdge(edges));
    },

    [nodes, dispatch]
  );

  const isValidConnection = (connection: any): boolean => {
    const { source, target } = connection;

    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

    if (!sourceNode || !targetNode) return false;

    if (source === target) {
      dispatch(
        setWarning({
          isWarning: true,
          message: "Cannot connect a node to itself.",
        })
      );
      return false;
    }

    if (sourceNode.type === "trigger") {
      const triggerConnections = edges.filter((edge) => edge.source === source);
      if (triggerConnections.length >= 1) {
        dispatch(
          setWarning({
            isWarning: true,
            message: "Trigger node can only have one connection.",
          })
        );
        return false;
      }
    }

    // const allowedTargets = allowedConnections[sourceNode.type as string];
    // if (!allowedTargets || !allowedTargets.includes(targetNode.type as string)) {
    //   console.warn(`Cannot connect ${sourceNode.type} node to ${targetNode.type} node.`);
    //   return false;
    // }

    return true;
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        className="text-background"
        panOnScroll
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
        isValidConnection={isValidConnection}
      >
        <Background />
        <Controls className="text-background" />
      </ReactFlow>
    </div>
  );
};
export default Workflow;
