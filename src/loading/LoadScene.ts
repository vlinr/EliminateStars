export default class LoadScene extends Laya.Script{
    private scene:any; //记录场景
    private lA:Laya.Sprite;
    constructor(){
        super();
    }
    //加载界面显示
    onEnable():void{
        console.log('加载界面!');
        this.scene=this.owner;
        //处理事件区域
        this.scene.width=Laya.stage.width;
        this.scene.height=Laya.stage.height;
        //处理一下适配,按照X进行适配
        let scX:number=Laya.Browser.window.scX;

        let loading:any=this.scene.getChildByName('loading');
        loading.width=this.scene.width;
        loading.height=this.scene.height;

        //处理logo
        let logo:any=this.scene.getChildByName('logo');
        let logoZone:any=logo.getBounds();
        logo.width=logoZone.width*scX;
        logo.height=logoZone.height*scX;
        logo.pos(logoZone.x*scX,logoZone.y*scX);

        //制作加载进度条
        let loadBg:Laya.Sprite=new Laya.Sprite();
        loadBg.width=662*scX;
        loadBg.height=52*scX;
        loadBg.graphics.drawTexture(Laya.loader.getRes('load/loadDefault.png'), 0, 0, 662 *scX, 52 *scX);
        //用于存放两个加载条

        let loadBox:Laya.Sprite=new Laya.Sprite();

        let lD:Laya.Sprite=new Laya.Sprite();
        lD.width=656*scX;
        lD.height=49*scX;
        lD.graphics.drawTexture(Laya.loader.getRes('load/loadActive1.png'), 0, 0, 656 *scX, 49 *scX);
        lD.pos(0,0);

        this.lA=new Laya.Sprite();
        this.lA.width=656*scX;
        this.lA.height=49*scX;
        this.lA.graphics.drawTexture(Laya.loader.getRes('load/loadActive.png'), 0, 0, 656 *scX, 49 *scX);
        this.lA.pos(-this.lA.width,0);

        loadBox.addChild(lD);
        loadBox.addChild(this.lA);
        loadBox.mask=lD;
        loadBox.pos((this.scene.width-lD.width)/2,this.scene.height/2+3);
        loadBg.pos((this.scene.width-loadBg.width)/2,this.scene.height/2);
        //添加到场景
        this.scene.addChild(loadBg);
        this.scene.addChild(loadBox);

        //处理提示
        let hTip:any=this.scene.getChildByName('hethTip');
        let hZone:any=hTip.getBounds();
        hTip.width=hZone.width*scX;
        hTip.height=hZone.height*scX;
        hTip.pos(hZone.x*scX,this.scene.height-hZone.height*1.4);
        var sourceArr:Array<any>=[  
			// {url:"GameScene/LoadScene.json",type:Laya.Loader.JSON},
			{url:'res/atlas/main.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/start.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/ranking.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/alive.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/prop.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/dayGift.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'res/atlas/inv.atlas',type:Laya.Loader.ATLAS}, //图集加载时这两个文件，不是图片
			{url:'main/mainBg.jpg',type:Laya.Loader.IMAGE},
			{url:'main/sA.png',type:Laya.Loader.IMAGE},
			{url:'main/sD.png',type:Laya.Loader.IMAGE},
			{url:'main/xz.png',type:Laya.Loader.IMAGE},
			{url:'start/youLike.png',type:Laya.Loader.IMAGE},
			{url:'max/maxBg.png',type:Laya.Loader.IMAGE},
			{url:'ranking/rBg.png',type:Laya.Loader.IMAGE},
			{url:'ranking/top.png',type:Laya.Loader.IMAGE},
			{url:'ranking/topSar.png',type:Laya.Loader.IMAGE},
			{url:'alive/aliveBg.png',type:Laya.Loader.IMAGE},
			{url:'prop/propBg.png',type:Laya.Loader.IMAGE},
			{url:'dayGift/giftBg.png',type:Laya.Loader.IMAGE},
			{url:'inv/invBg.png',type:Laya.Loader.IMAGE},
			// {url:'main/sD1.png',type:Laya.Loader.IMAGE},
		];
		//加载加载界面资源，防止黑屏
		Laya.loader.load(sourceArr,null,Laya.Handler.create(this,(e:Laya.Event):void=>{
			this.onProgress(e);
		},null,false));
    }
    private onProgress(pros:any):void{
        let nowLoad:number=pros*100; //根据回调，进行百分比计算
        this.lA.x=-this.lA.width+this.lA.width/100*nowLoad;
        if(nowLoad==100)this.gameTip();  //加载完成后进入加载界面
    }
    //进入游戏提示界面
    private gameTip():void{
        console.log('进入游戏主界面');
        let scene:Laya.Scene=new Laya.Scene();
		//创建这个场景,分离模式这样使用
		scene.loadScene('GameScene/GameTip.scene');
		//分离模式
		Laya.stage.addChild(scene);
    }
}