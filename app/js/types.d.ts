export type InputPluginType = "rawString" | "url";

export interface InputPlugin {
  ty: InputPluginType;
  val: string;
}
