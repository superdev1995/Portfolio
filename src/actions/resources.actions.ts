import actionCreatorFactory from "typescript-fsa";

import { IDynamoResponse, IResource } from "../models/root.models";

const createAction = actionCreatorFactory("RESOURCES");

export const fetchResources = createAction.async<
  {},
  IDynamoResponse<IResource, "createdAt">
>("FETCH");

export const fetchMoreResources = createAction.async<
  {},
  IDynamoResponse<IResource, "createdAt">
>("FETCH_MORE");
