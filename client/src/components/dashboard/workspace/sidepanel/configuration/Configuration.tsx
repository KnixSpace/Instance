import * as Yup from "yup";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Node } from "@/types/workflowTypes";
import {
  setSidePanelMode,
  updateNodeConfig,
} from "@/lib/features/workflow/workflowSlice";
import { useAppDispatch } from "@/lib/hooks";
import { actionConfig } from "../../constant";
import { useNodeConfiguration } from "@/hooks/useNodeConfiguration";
import AccountInfo from "../account/AccountInfo";
import ConfigurationForm from "./ConfigurationForm";
import { useDefalutValues } from "@/hooks/useDefaultValues";

const Configuration = ({ selectedNode }: { selectedNode: Node }) => {
  const dispatch = useAppDispatch();

  const nodeConfig = useMemo(
    () =>
      actionConfig.find((config) => config.action === selectedNode.data.action),
    [selectedNode.data.action]
  );

  if (!nodeConfig) return null;

  const defaultValues = useDefalutValues(nodeConfig.configFields);

  const schema = useMemo(
    () =>
      Yup.object().shape(
        nodeConfig.configFields.reduce((acc, field) => {
          acc[field.name] = field.validation;
          return acc;
        }, {} as Record<string, Yup.AnySchema>)
      ),
    [nodeConfig.configFields]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues,
  });

  const { dynamicOptions } = useNodeConfiguration(
    selectedNode,
    nodeConfig,
    watch
  );

  const handleChangeAccount = useCallback(() => {
    dispatch(setSidePanelMode("account"));
  }, [dispatch]);

  //WIP: handle form submit
  const handleFormSubmit = useCallback(
    (data: Record<string, any>) => {
      console.log(data);
      // Add your submit logic here
      dispatch(updateNodeConfig({ nodeId: selectedNode.id, config: data }));
    },
    [dispatch, selectedNode.id]
  );

  useEffect(() => {
    //WIP: reset form with initial values or previously saved values in redux node.data.config
    reset();
  }, [selectedNode.id, reset]);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-auto">
      <AccountInfo
        account={selectedNode.data.authAccountInfo}
        onChangeAccount={handleChangeAccount}
      />
      <div className="flex-1 overflow-auto">
        <ConfigurationForm
          nodeConfig={nodeConfig}
          control={control}
          errors={errors}
          dynamicOptions={dynamicOptions}
          onSubmit={handleSubmit(handleFormSubmit)}
        />
      </div>
    </div>
  );
};
export default memo(Configuration);
