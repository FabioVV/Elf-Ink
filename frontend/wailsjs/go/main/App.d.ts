// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {context} from '../models';

export function BeforeClose(arg1:context.Context):Promise<void>;

export function CreateNewLeaf(arg1:string,arg2:{[key: string]: any}):Promise<any>;

export function CreateNewNotebook(arg1:string,arg2:{[key: string]: string}):Promise<any>;

export function DeleteLeaf(arg1:string,arg2:number):Promise<any>;

export function DeleteNotebook(arg1:string,arg2:number):Promise<any>;

export function GetActiveLeaf(arg1:string):Promise<any>;

export function GetActiveNotebook(arg1:string,arg2:string):Promise<any>;

export function GetActiveNotebookLeafs(arg1:string,arg2:string):Promise<any>;

export function GetActiveNotebookPinnedLeafs(arg1:string):Promise<any>;

export function GetNotebooks(arg1:string,arg2:string):Promise<any>;

export function LoginUser(arg1:{[key: string]: string}):Promise<{[key: string]: string}>;

export function LogoutUser(arg1:string):Promise<{[key: string]: string}>;

export function PatchLeafName(arg1:string,arg2:number,arg3:string):Promise<any>;

export function PatchNotebookName(arg1:string,arg2:number,arg3:string):Promise<any>;

export function RegisterUser(arg1:{[key: string]: string}):Promise<any>;

export function SetNewActiveLeaf(arg1:string,arg2:any):Promise<any>;

export function SetNewActiveNotebook(arg1:string,arg2:number):Promise<any>;

export function SetNewStatusLeaf(arg1:string,arg2:{[key: string]: any}):Promise<any>;

export function SubmitNewPinnedLeaf(arg1:string,arg2:any):Promise<any>;

export function SubmitRemovedPinnedLeaf(arg1:string,arg2:any):Promise<any>;

export function UpdateLeaf(arg1:string,arg2:string,arg3:number):Promise<any>;

export function ValidateSession(arg1:string):Promise<{[key: string]: string}>;
