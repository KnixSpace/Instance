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
import { useCallback, useEffect, useRef } from "react";
import { v4 } from "uuid";

import TriggerNode from "./customNodes/TriggerNode";
import ActionNode from "./customNodes/ActionNode";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addNewEdge,
  addNewNode,
  selectNode,
  setAdjacencyList,
  setDeletedNodes,
  setWarning,
} from "@/redux/features/workflow/workflowSlice";
import { getNextNodes } from "@/utils/workflowUtils";
import { Node } from "@/types/workflowTypes";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

type Props = {};

const Workflow = (props: Props) => {
  const flow = useAppSelector((state) => state.workflow);
  // console.log("f nodes", flow.nodes);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const dispatch = useAppDispatch();

  const isUserAction = useRef(false);

  useEffect(() => {
    if (flow?.nodes) {
      setNodes(flow.nodes);
    }
    if (flow?.edges) {
      setEdges(flow.edges);
    }
  }, [flow?.nodes, flow?.edges]);

  useEffect(() => {
    if (isUserAction.current) {
      dispatch(addNewEdge(edges));
      dispatch(setAdjacencyList());
      isUserAction.current = false;
    }
  }, [edges, dispatch]);

  const onConnect = useCallback(
    (params: any) => {
      isUserAction.current = true;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

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
      isUserAction.current = true;
      const updatedEdges = edges.filter((edge) => !deletedEdges.includes(edge));
      dispatch(addNewEdge(updatedEdges));
    },
    [edges, dispatch]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      isUserAction.current = true;
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

    [nodes, dispatch, flow.forwardList]
  );

  const isValidConnection = useCallback(
    (connection: any): boolean => {
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
        const triggerConnections = edges.filter(
          (edge) => edge.source === source
        );
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

      return true;
    },
    [nodes, edges, dispatch]
  );

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
        onNodesChange={(changes) => {
          isUserAction.current = true;
          // console.log("node chnages", changes);
          onNodesChange(changes);
        }}
        onNodeClick={handleNodeClick}
        edges={edges}
        onEdgesChange={(changes) => {
          isUserAction.current = true;
          onEdgesChange(changes);
        }}
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
