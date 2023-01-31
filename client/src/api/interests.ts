import {SERVER_URI} from "../config";
import {TreeNode} from "react-dropdown-tree-select";

export function getSecondaryInterests(main:string, setInterests:(interests:TreeNode[])=>void){
    fetch(`${SERVER_URI}/interests/${main}`)
        .then(res => {
            if(res.ok)
                return res.json() as Promise<TreeNode[]>
            else
                console.log("error")
        })
        .then(interests => {
            if(interests)
                setInterests(interests)
        })
}