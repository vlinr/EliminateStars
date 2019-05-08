
import GameItem from './GameItem'
import PopupManager from '../popup/PopupManager'
export default class LoadScene extends Laya.Script {
    private scene: any; //记录场景
    private jewelNum: Laya.Text;
    constructor() {
        super();
    }
    //提示界面
    onEnable(): void {
        this.scene = this.owner;
        //处理事件区域
        this.scene.width = Laya.stage.width;
        this.scene.height = Laya.stage.height;
        //处理一下适配,按照X进行适配
        let scX: number = Laya.Browser.window.scX;

        let tipBg: any = this.scene.getChildByName('tipBg');
        tipBg.width = this.scene.width;
        tipBg.height = this.scene.height;

        this.initTips();
    }
    //添加界面元素
    private initTips(): void {
        //从上到下依次添加
        let scX: number = Laya.Browser.window.scX;
        //钻石
        let jewelBg: Laya.Sprite = this.getImage('start/rect.png', 194 * scX, 61 * scX, 70 * scX, 55 * scX);
        //钻石
        let jewel: Laya.Sprite = this.getImage('start/gone.png', 47 * scX, 41 * scX, 10 * scX, 11 * scX);
        jewelBg.addChild(jewel);
        //数量
        this.jewelNum = new Laya.Text();
        this.jewelNum.fontSize = 32 * scX;
        this.jewelNum.color = '#fff';
        this.jewelNum.text = '9';
        this.jewelNum.bold = true;
        this.jewelNum.align = 'center';
        this.jewelNum.width = jewelBg.width - jewel.width * 2;
        this.jewelNum.pos(jewel.x + jewel.width, (jewelBg.height - this.jewelNum.height / 1.2) / 2);
        jewelBg.addChild(this.jewelNum);
        this.scene.addChild(jewelBg);

        //添加logo
        let logo: Laya.Sprite = this.getImage('load/logo.png', 333 * scX, 333 * scX, (this.scene.width - 333 * scX) / 2, 130 * scX);
        this.scene.addChild(logo);

        //添加中部开始按钮
        let startBox: Laya.Sprite = new Laya.Sprite(); //用于存放开始按钮组
        startBox.width = 327 * scX;

        let startBtn: Laya.Sprite = this.getImage('start/start.png', 327 * scX, 118 * scX, (startBox.width - 327 * scX) / 2, 0);
        startBtn.on(Laya.Event.CLICK, this, this.startBtn);
        startBtn.zOrder = 2;
        startBox.addChild(startBtn);

        //添加角色
        let role: Laya.Sprite = this.getImage('start/role.png', 103 * scX, 157 * scX, (startBox.width - 103 * scX) / 2, -157 * scX / 1.3);
        role.zOrder = 1;
        startBox.addChild(role);

        //添加底部最高纪录
        let maxScoreBox: Laya.Sprite = new Laya.Sprite();
        maxScoreBox.y = startBtn.y + startBtn.height + 20 * scX;
        startBox.addChild(maxScoreBox);

        let maxIcon: Laya.Sprite = this.getImage('start/max.png', 47 * scX, 49 * scX, 0, 0);
        let maxText: Laya.Sprite = this.getImage('start/maxText.png', 132 * scX, 32 * scX, maxIcon.x + maxIcon.width * 1.2, (maxIcon.height - 32 * scX) / 2);
        maxScoreBox.width = maxIcon.width * 1.2 + maxText.width;
        maxScoreBox.x = (startBox.width - maxScoreBox.width) / 2;
        maxScoreBox.height = maxIcon.height;
        maxScoreBox.addChild(maxIcon);
        maxScoreBox.addChild(maxText);
        maxScoreBox.on(Laya.Event.CLICK, this, this.popupMax);
        startBox.height = startBtn.height + role.height + maxIcon.height + maxText.height
        startBox.pos((this.scene.width - startBox.width) / 2, (this.scene.height - startBox.height) / 1.6);
        this.scene.addChild(startBox);

        //添加底部，包括按钮+猜您喜欢
        let btmBox: Laya.Sprite = new Laya.Sprite();
        //添加邀请奖励
        let invitBox: Laya.Sprite = new Laya.Sprite();
        invitBox.width = 131 * scX;
        let inviText: Laya.Sprite = this.getImage('start/giftText.png', 131 * scX, 29 * scX, 0, 0);
        let invitIcon: Laya.Sprite = this.getImage('start/giftBtn.png', 106 * scX, 111 * scX, (inviText.width - 106 * scX) / 2, -111 * scX);
        invitBox.height = inviText.height + invitIcon.height;
        invitBox.addChild(inviText);
        invitBox.addChild(invitIcon);
        invitBox.pos((this.scene.width - invitBox.width) / 2, 111 * scX)

        //添加排行
        let rankBox: Laya.Sprite = new Laya.Sprite();
        rankBox.width = 113 * scX;
        let rankIcon: Laya.Sprite = this.getImage('start/ranking.png', 113 * scX, 113 * scX, 0, 0);
        let rankText: Laya.Sprite = this.getImage('start/rankingText.png', 98 * scX, 29 * scX, (rankIcon.width - 98 * scX) / 2, 111 * scX);
        rankBox.height = rankText.height + rankIcon.height;
        rankBox.addChild(rankText);
        rankBox.addChild(rankIcon);
        rankBox.pos(invitBox.x - invitBox.width * 2, 0)

        //添加分享
        let shareBox: Laya.Sprite = new Laya.Sprite();
        shareBox.width = 113 * scX;
        let shareIcon: Laya.Sprite = this.getImage('start/share.png', 106 * scX, 97 * scX, 0, 0);
        let shareText: Laya.Sprite = this.getImage('start/shareext.png', 62 * scX, 29 * scX, (shareIcon.width - 62 * scX) / 2, 111 * scX);
        shareBox.height = shareText.height + shareIcon.height;
        shareBox.addChild(shareText);
        shareBox.addChild(shareIcon);
        shareBox.pos(invitBox.x + invitBox.width * 2, 0)

        btmBox.addChild(invitBox);
        btmBox.addChild(rankBox);
        btmBox.addChild(shareBox);
        btmBox.pos(0, startBox.y + startBox.height / 2 + 60 * scX);
        this.scene.addChild(btmBox);

        invitBox.on(Laya.Event.CLICK,this,this.openInvit);
        rankBox.on(Laya.Event.CLICK,this,this.openRanking);
        shareBox.on(Laya.Event.CLICK,this,this.openShare);
        //添加猜您喜欢
        let youLike: Laya.Sprite = this.getImage('start/youLike.png', 750 * scX, 145 * scX, 0, invitBox.y + inviText.height + 30 * scX);

        let gameList: Laya.List = this.moreGameList();
        gameList.pos(25 * scX, 35 * scX);
        youLike.addChild(gameList);

        btmBox.addChild(youLike);
        //添加浮动元素
        this.scene.addChild(this.floatRole());

        //添加星星
        this.scene.addChild(this.randomStar());

        let maxResult:any=new PopupManager();
        this.scene.addChild(maxResult);
        maxResult.invGift();
    }
    //添加星星
    private randomStar():Laya.Sprite{
        let scX: number = Laya.Browser.window.scX;
        let starBox:Laya.Sprite=new Laya.Sprite();
        let star: Laya.Sprite = this.getImage('start/star.png', 49 * scX, 52 * scX, -49*scX,this.scene.height/1.4);
        star.pivot(star.width/2,star.height/2);
        let starTween: Laya.TimeLine = new Laya.TimeLine();
        starTween.to(star, {
            y:80*scX,
            x:this.scene.width+200*scX,
            rotation:600
        }, 1000, Laya.Ease.linearInOut, 0);
        starTween.to(star, {
           
        }, 3000, Laya.Ease.linearInOut, 0);
        starTween.to(star, {
            y:this.scene.height/1.4,
            x: -49*scX,
            rotation:0
        }, 0, Laya.Ease.linearInOut, 0);
        starTween.play(0, true);

        let star1: Laya.Sprite = this.getImage('start/star.png', 49 * scX, 52 * scX, -49*scX,this.scene.height/2);
        star1.pivot(star1.width/2,star1.height/2);
        let starTween1: Laya.TimeLine = new Laya.TimeLine();
        starTween1.to(star1, {
            y:-200*scX,
            x:this.scene.width,
            rotation:600
        }, 1000, Laya.Ease.linearInOut,100);
        starTween1.to(star1, {
           
        }, 3000, Laya.Ease.linearInOut, 0);
        starTween1.to(star1, {
            y:this.scene.height/1.4,
            x: -49*scX,
            rotation:0
        }, 0, Laya.Ease.linearInOut, 0);
        starTween1.play(0, true);

        starBox.addChild(star);
        starBox.addChild(star1);
        return starBox;
    }

    //浮动元素
    private floatRole(): Laya.Sprite {
        let scX: number = Laya.Browser.window.scX;
        let giftBox: Laya.Sprite = new Laya.Sprite();
        giftBox.width=this.scene.width;
        giftBox.height=this.scene.height;
        giftBox.pos(0,0);
        let gift1: Laya.Sprite = this.getImage('start/gift1.png', 131 * scX, 135 * scX, 45 * scX, 300 * scX);
        let gift2: Laya.Sprite = this.getImage('start/gift2.png', 131 * scX, 136 * scX, 590 * scX, 360 * scX);
        let gift3: Laya.Sprite = this.getImage('start/gift3.png', 90 * scX, 93 * scX, 595 * scX, 565 * scX);
        let gift4: Laya.Sprite = this.getImage('start/gift4.png', 106 * scX, 111 * scX,  70* scX, 675 * scX);

        giftBox.addChild(gift1);
        giftBox.addChild(gift2);
        giftBox.addChild(gift3);
        giftBox.addChild(gift4);

        //添加动画，让其动起来
        let tweenGift1: Laya.TimeLine = new Laya.TimeLine();
        let g1y:number=gift1.y;
        tweenGift1.to(gift1, {
            y:g1y-30*scX
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift1.to(gift1, {
            y:g1y
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift1.play(0, true)

        let tweenGift2: Laya.TimeLine = new Laya.TimeLine();
        let g2y:number=gift2.y;
        tweenGift2.to(gift2, {
            y:g2y-40*scX
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift2.to(gift2, {
            y:g2y
        }, 3000, Laya.Ease.linearInOut, 0);
        tweenGift2.play(0, true)

        let tweenGift3: Laya.TimeLine = new Laya.TimeLine();
        let g3y:number=gift3.y;
        tweenGift3.to(gift3, {
            y:g3y-25*scX
        }, 3300, Laya.Ease.linearInOut, 0);
        tweenGift3.to(gift3, {
            y:g3y
        }, 3300, Laya.Ease.linearInOut, 0);
        tweenGift3.play(0, true)

        let tweenGift4: Laya.TimeLine = new Laya.TimeLine();
        let g4y:number=gift4.y;
        tweenGift4.to(gift4, {
            y:g4y-30*scX
        }, 4000, Laya.Ease.linearInOut, 0);
        tweenGift4.to(gift4, {
            y:g4y
        }, 4000, Laya.Ease.linearInOut, 0);
        tweenGift4.play(0, true)
        return giftBox;
    }

    //排行
    private openRanking():void{
        console.log('排行')
    }
    //邀请
    private openInvit():void{
        console.log('邀请')
    }
    //分享
    private openShare():void{
        console.log('分享')
    }
    //随机获取一个图标，给一个动画
    private randIcon():void{
        let iconArr:Array<any>=[];
    }
    //弹出最高纪录列表
    private popupMax(): void {
        console.log('弹出最高纪录')
    }
    //处理开始游戏逻辑,如授权等操作
    private startBtn(): void {
        console.log('开始游戏')
    }
    private getImage(key: string, _w: number, _h: number, x: number = 0, y: number = 0): Laya.Sprite {
        let sp: Laya.Sprite = new Laya.Sprite();
        sp.width = _w;
        sp.height = _h;
        sp.graphics.drawTexture(Laya.loader.getRes(`${key}`), 0, 0, _w, _h);
        sp.pos(x, y);
        return sp;
    }
    //更多游戏列表
    private moreGameList(): Laya.List {
        let scX: number = Laya.Browser.window.scX;
        let layaList: Laya.List = new Laya.List();
        layaList.itemRender = GameItem; //必须设置，这个类代表更新时候的处理
        layaList.repeatX = 4;
        layaList.repeatY = 1; //y轴个数 
        layaList.name = 'layaList';
        layaList.x = 0;
        layaList.y = 0
        // 使用但隐藏滚动条
        layaList.hScrollBarSkin = "";
        layaList.selectEnable = true;
        // layaList.selectHandler = new Laya.Handler(this, this.onSelect);
        // layaList.renderHandler = new Laya.Handler(this, this.updateItem);
        let data: Array<any> = [];
        for (let i: number = 0; i < 10; ++i) {
            let gameBox: Laya.Sprite = new Laya.Sprite();
            gameBox.width = 103 * scX;
            gameBox.height = 103 * scX;
            //设置属性
            Object.defineProperty(gameBox, 'appId', {
                value: '123456'
            })
            let itemSprite: Laya.Sprite = new Laya.Sprite();
            itemSprite.width = 103 * scX;
            itemSprite.height = 103 * scX;
            itemSprite.graphics.drawTexture(Laya.loader.getRes('start/gameCir.png'), 0, 0, 103 * scX, 103 * scX);
            itemSprite.pos((700 * scX / 4 - itemSprite.width) / 2, 0)
            gameBox.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
                let target: any = e.target;
                console.log('打开小游戏')
                //     // wx.navigateToMiniProgram({
                //     //     appId: target._dataSource.appId,
                //     //     path: 'page/index/index',
                //     //     extraData: {
                //     //         formChannel: 'morePlay'
                //     //     },
                //     //     envVersion: 'develop',
                //     //     success(res) {
                //     //         // 打开成功
                //     //     }
                //     // })
            });
            //添加游戏图标
            let gameImg: Laya.Sprite = new Laya.Sprite();
            // gameImg.loadImage(listData[i].icon);
            gameImg.width = 103 * scX;
            gameImg.height = 103 * scX;
            gameImg.graphics.drawTexture(Laya.loader.getRes('start/game.png'), 0, 0, 103 * scX, 103 * scX);
            gameImg.pos((700 * scX / 4 - gameImg.width) / 2, 0)
            gameBox.addChild(itemSprite);
            gameBox.addChild(gameImg);
            gameBox.mask = itemSprite;
            data.push(gameBox);
        }
        layaList.array = data;
        return layaList;
    }
}