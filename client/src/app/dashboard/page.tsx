"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconEdit,
  IconEye,
  IconFile,
  IconSearch,
  IconSettings,
  IconUserBolt,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import FormPopup from "./FormPopup";

interface LinkType {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PlatformService {
  name: string;
  services: string[];
}

const platformServices: PlatformService[] = [
  {
    name: "Google",
    services: ["Gmail", "Drive", "Sheets", "Docs", "Calendar"],
  },
  {
    name: "GitHub",
    services: [
      "Repositories",
      "Issues",
      "Pull Requests",
      "Actions",
      "Projects",
    ],
  },
  {
    name: "LinkedIn",
    services: ["Profile", "Jobs", "Networking", "Learning", "Company Pages"],
  },
];

const ServiceModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
  updateNode: (type: string) => void;
  selectedNode: string | null;
}> = ({ showModal, closeModal, updateNode, selectedNode }) => {
  if (!showModal) return null;

  const handleServiceClick = (service: string) => {
    updateNode(service); // Directly update the node and open form
  };

  return (
    <div className={`fixed inset-0 z-50 ${showModal ? "" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      />
      <div className="relative bg-black p-5 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Select an application</h2>
        <div className="grid grid-cols-3 gap-4">
          {platformServices.map((platform) => (
            <div key={platform.name}>
              <h3 className="font-bold mb-2">{platform.name}</h3>
              <ul>
                {platform.services.map((service) => (
                  <li key={service}>
                    <button
                      key={service}
                      className="block w-full text-left px-4 py-2 hover:bg-cta rounded"
                      onClick={() => handleServiceClick(service)}
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={closeModal} className="mt-4 text-red-500">
          Close
        </button>
      </div>
    </div>
  );
};

const CustomNode = ({ data, id }: NodeProps) => {
  const { setNodes, setEdges, getNode, getNodes, getEdges } = useReactFlow();

  const onDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent the click event from bubbling up to the node
      if (id !== "1" && id !== "2") {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id)
        );
      }
    },
    [id, setNodes, setEdges]
  );

  const addChildNode = useCallback(
    (event: React.MouseEvent, parentId: string) => {
      event.stopPropagation(); // Prevent the click event from bubbling up to the node

      const parentNode = getNode(parentId);
      if (!parentNode) return;

      // Find all existing child nodes of the parent
      const childNodes = getNodes().filter((node) =>
        getEdges().some(
          (edge) => edge.source === parentId && edge.target === node.id
        )
      );

      setNodes((nds) => {
        // Find the highest existing node ID and increment it
        const newId = Math.max(...nds.map((node) => parseInt(node.id))) + 1;

        // Calculate the y-offset based on the number of existing children
        const yOffset = 100; // Base vertical spacing between nodes
        const verticalPosition = parentNode.position.y + yOffset;

        // Create new node position below the parent
        const newNode: Node = {
          id: newId.toString(),
          type: "custom",
          position: {
            x: parentNode.position.x, // Keep same X level as parent
            y: verticalPosition, // Position below parent
          },
          data: { label: "New Action" },
        };

        return [...nds, newNode];
      });

      setEdges((eds) => {
        // Create new edge connecting parent to new node
        const newId =
          Math.max(...eds.map((edge) => parseInt(edge.id.replace("e", "")))) +
          1;

        const newEdge: Edge = {
          id: `e${newId}`,
          source: parentId,
          target: (
            Math.max(...eds.map((edge) => parseInt(edge.target))) + 1
          ).toString(),
          type: "custom",
          style: { strokeWidth: 2 },
        };

        return [...eds, newEdge];
      });
    },
    [setNodes, setEdges, getNode, getNodes, getEdges]
  );

  return (
    <div className="bg-white border-2 border-gray-200 rounded p-3 shadow-md min-w-[150px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800 mr-2">{data.label}</span>
        <div className="flex gap-2">
          {/* Only show "+" button if not Trigger node (id !== "1") */}
          {id !== "1" && (
            <button
              onClick={(e) => addChildNode(e, id)}
              className="text-green-500 hover:text-green-700"
            >
              <IconPlus size={18} />
            </button>
          )}
          {/* Only show "x" button if not Trigger or initial Action node */}
          {id !== "1" && id !== "2" && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <IconX size={18} />
            </button>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();

  const onDelete = useCallback(() => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  }, [id, setEdges]);

  const edgePath = `M${sourceX},${sourceY} C ${sourceX},${
    sourceY + 50
  } ${targetX},${targetY - 50} ${targetX},${targetY}`;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <foreignObject
        width={20}
        height={20}
        x={(sourceX + targetX) / 2 - 10}
        y={(sourceY + targetY) / 2 - 10}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="w-full h-full flex items-center justify-center">
          <button
            onClick={onDelete}
            className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
          >
            <IconX size={12} />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const PlatformDropdown: React.FC<{
  platform: PlatformService;
  addNode: (type: string) => void;
}> = ({ platform, addNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 text-left"
      >
        {platform.name}
        {isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="mt-1 ml-4">
          {platform.services.map((service) => (
            <button
              key={service}
              onClick={() => addNode(`${platform.name} - ${service}`)}
              className="block w-full text-left px-4 py-2 hover:bg-cta rounded"
            >
              {service}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarDemo: React.FC = () => {
  const links: LinkType[] = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ongoing Flows",
      href: "#",
      icon: (
        <IconFile className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Completed Flows",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Drafts",
      href: "#",
      icon: (
        <IconEdit className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logs",
      href: "#",
      icon: (
        <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Connected Apps",
      href: "#",
      icon: (
        <IconEye className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [openLeft, setOpenLeft] = useState<boolean>(false);
  const [openRight, setOpenRight] = useState<boolean>(true);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "custom",
      position: { x: 500, y: 250 },
      data: { label: "Trigger" },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 500, y: 400 },
      data: { label: "Action" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // Control form popup visibility
  const [selectedService, setSelectedService] = useState<string | null>(null); // Store selected service

  useEffect(() => {
    // Create default connection between Trigger and Action nodes
    setEdges([{ id: "e1-2", source: "1", target: "2", type: "custom" }]);
  }, [setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "custom" }, eds)),
    [setEdges]
  );

  const updateNode = useCallback(
    (type: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode) {
            return { ...node, data: { ...node.data, label: type } };
          }
          return node;
        })
      );
      setSelectedService(type); // Set the selected service
      setIsFormOpen(true); // Open form popup
    },
    [selectedNode, setNodes]
  );

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (!(event.target as HTMLElement).closest("button")) {
      setSelectedNode(node.id);
      setShowModal(true);
    }
  };

  const closeFormPopup = () => setIsFormOpen(false); // Close form popup handler

  const handleServiceSelection = (service: string) => {
    updateNode(service);
    setSelectedService(service); // Store selected service
    setIsFormOpen(true); // Open the form directly
    setShowModal(false); // Close the modal
  };

  return (
    <div className="h-dvh w-full flex">
      {/* Left Sidebar */}
      <div className="">
        <Sidebar open={openLeft} setOpen={setOpenLeft}>
          <SidebarBody className="justify-between gap-10 h-full w-full">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-2">
              {openLeft ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Log Out",
                  href: "#",
                  icon: (
                    <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Service Modal */}
      <ServiceModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        updateNode={handleServiceSelection} // Pass handleServiceSelection to directly open form
        selectedNode={selectedNode}
      />
      {/* Form Popup */}
      {isFormOpen && selectedService && (
        <FormPopup
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          nodeData={selectedService} // Pass the selected service to the form
        />
      )}

      {/* Right Sidebar */}
      {/* <div className="ml-auto">
        <Sidebar open={openRight} setOpen={setOpenRight}>
          <SidebarBody className="justify-between gap-10 h-full w-full ">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-2">
              <h2 className="text-lg font-semibold mb-4">Triggers & Actions</h2>
              {platformServices.map((platform) => (
                <PlatformDropdown
                  key={platform.name}
                  platform={platform}
                  addNode={addNode}
                />
              ))}
            </div>
          </SidebarBody>
        </Sidebar>
      </div> */}
    </div>
  );
};

export default SidebarDemo;

export const Logo: React.FC = () => {
  return (
    <Link
      href="#"
      className="font-normal flex gap-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/logo.webp" alt="Logo" width={30} height={30} />
      <span className="text-base font-medium text-black dark:text-white whitespace-pre">
        Instance
      </span>
    </Link>
  );
};

export const LogoIcon: React.FC = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
