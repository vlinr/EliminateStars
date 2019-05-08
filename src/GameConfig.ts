/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameTip from "./gametip/GameTip"
import LoadScene from "./loading/LoadScene"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1334;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="GameScene/LoadScene.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("gametip/GameTip.ts",GameTip);
        reg("loading/LoadScene.ts",LoadScene);
    }
}
GameConfig.init();