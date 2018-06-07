import Node from "./Node";
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class Block extends Node {
    type: NOTE_TYPE = NOTE_TYPE.BLOCK;
}
