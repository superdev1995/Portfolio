import actionCreatorFactory from "typescript-fsa";

import { IDynamoResponse, IStem } from "../models/root.models";

const createAction = actionCreatorFactory("STEMS");

export const fetchStems = createAction.async<
  {},
  IDynamoResponse<IStem, "createdAt">
>("FETCH");

export const fetchMoreStems = createAction.async<
  {},
  IDynamoResponse<IStem, "createdAt">
>("FETCH_MORE");
