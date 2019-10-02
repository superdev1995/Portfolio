import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("SERVICE_WORKER");

export const receiveServiceWorkerMessage = createAction<{
  type: string;
  payload?: any;
}>("RECEIVE_MESSAGE");
