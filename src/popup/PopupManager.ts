import ItemRank from './ItemRank'
import ItemInv from './ItemInv'
export default class PopupManager extends Laya.Sprite {
    private rbg: Laya.Sprite;
    constructor() {
        super();
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.pos(0, 0);
    }
    //最高纪录弹出
    public maxList(): void {
        let maxOpacity: Laya.Sprite = this.opacityBg();
        // let maxBg:

        this.addChild(maxOpacity);
    }
    //制作排行
    public rankBox(): void {
        let rankOpacity: Laya.Sprite = this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        this.rbg = this.getImage('ranking/rBg.png', 679 * scX, 928 * scX, (rankOpacity.width - 679 * scX) / 2, (rankOpacity.height - 928 * scX) / 2);

        //添加星星
        let rstar: Laya.Sprite = this.getImage('ranking/topSar.png', 520 * scX, 180 * scX, (this.rbg.width - 520 * scX) / 2, -180 * scX / 1.2);
        rstar.zOrder = 5;

        //添加锅盖
        let rgz: Laya.Sprite = this.getImage('ranking/top.png', 669 * scX, 177 * scX, (this.rbg.width - 669 * scX) / 2, -177 * scX / 4);
        rgz.zOrder = 4;

        //添加按钮
        let btn: Laya.Sprite = this.getImage('ranking/friend.png', 456 * scX, 99 * scX, (this.rbg.width - 456 * scX) / 2 - 3 * scX, 60 * scX);
        btn.zOrder = 3;
        btn.on(Laya.Event.CLICK, this, e => {
            if (e.stageX < Laya.stage.width / 2) {
                console.log('打开好友排行')
                btn.graphics.clear();  //先清除原来的纹理
                var texture = Laya.loader.getRes('ranking/friend.png'); //获取已加载的新的纹理
                btn.graphics.drawTexture(texture, 0, 0, 456 * scX, 99 * scX); //开始绘制
                // 设置交互区域
                btn.size(texture.width, texture.height);
                let frData: any = this.friendRankList();
                if (frData != null) this.rbg.addChild(frData);
            } else {
                console.log('打开世界排行')
                btn.graphics.clear();  //先清除原来的纹理
                var texture = Laya.loader.getRes('ranking/world.png'); //获取已加载的新的纹理
                btn.graphics.drawTexture(texture, 0, 0, 456 * scX, 99 * scX); //开始绘制
                // 设置交互区域
                btn.size(texture.width, texture.height);
                let wrData: any = this.worldList();
                if (wrData != null) this.rbg.addChild(wrData);
            }
        });
        //添加关闭
        let close: Laya.Sprite = this.getImage('ranking/close.png', 76 * scX, 62 * scX, this.rbg.width - 76 * scX, -62 * scX / 2);
        close.zOrder = 6;
        close.on(Laya.Event.CLICK, this, () => {
            this.removeSelf();
        });
        //添加分享
        let share: Laya.Sprite = this.getImage('ranking/share.png', 148 * scX, 61 * scX, (this.rbg.width - 148 * scX)/2,this.rbg.height);
        share.on(Laya.Event.CLICK, this, () => {
            console.log('分享')
        });
        this.rbg.addChild(rstar);
        this.rbg.addChild(rgz);
        this.rbg.addChild(btn);
        this.rbg.addChild(close);
        this.rbg.addChild(share);
        this.rbg.addChild(this.friendRankList());
        rankOpacity.addChild(this.rbg);
        this.addChild(rankOpacity);
    }
    //世界排行
    private worldList(): Laya.Sprite {
        let wrData: any = this.rbg.getChildByName('layaList');
        let openData: any = this.rbg.getChildByName('openData');
        if (openData != null) openData.visible = false;
        if (wrData != null) {
            wrData.visible = true;
            return null;
        }
        let spriteBox: Laya.Sprite = new Laya.Sprite();
        spriteBox.name = 'layaList';
        //添加列表
        let layaList: Laya.List = new Laya.List();
        let scX: number = Laya.Browser.window.scX;
        let scY: number = Laya.Browser.window.scY;
        layaList.itemRender = ItemRank; //必须设置，这个类代表更新时候的处理
        layaList.repeatX = 1;
        layaList.repeatY = 6; //y轴个数 
        // layaList.name = 'layaList';
        layaList.x = 0;
        // layaList.y = this.friendBtn.y + this.friendBtn.height * 1.5;
        layaList.y = 0;
        // 使用但隐藏滚动条
        layaList.vScrollBarSkin = "";
        layaList.selectEnable = true;
        // layaList.selectHandler = new Laya.Handler(this, this.onSelect);
        // layaList.renderHandler = new Laya.Handler(this, this.updateItem);
        let data: Array<any> = [];
        for (let i: number = 0; i < 100; ++i) {
            //添加背景
            let listItem: Laya.Sprite = new Laya.Sprite();
            listItem.width = 450 * scX;
            listItem.height = 90 * scX;
            listItem.pos(0, i * 15);
            listItem.graphics.drawTexture(Laya.loader.getRes('ranking/list.png'), 0, 0, 450 * scX, 90 * scX);
            var rankNum: any;
            //添加名次
            if (i == 0) {
                rankNum = new Laya.Sprite();
                rankNum.width = 52 * scX;
                rankNum.height = 58 * scX;
                rankNum.graphics.drawTexture(Laya.loader.getRes('ranking/gold.png'), 0, 0, 52 * scX, 58 * scX);
            } else if (i == 1) {
                rankNum = new Laya.Sprite();
                rankNum.width = 58 * scX;
                rankNum.height = 64 * scX;
                rankNum.graphics.drawTexture(Laya.loader.getRes('ranking/yin.png'), 0, 0, 58 * scX, 64 * scX);
            } else {
                rankNum = new Laya.Text();
                rankNum.text = `${i + 1}`;
                rankNum.color = '#fcd26f';
                rankNum.fontSize = 26 * scX;
            }
            rankNum.pos((75 * scX - rankNum.width) / 2, (listItem.height - rankNum.height) / 2);
            listItem.addChild(rankNum);

            let imgBox: Laya.Sprite = new Laya.Sprite();
            let opacImg: Laya.Sprite = new Laya.Sprite();
            opacImg.width = 64 * scX;
            opacImg.height = 65 * scX;
            opacImg.graphics.drawTexture(Laya.loader.getRes('ranking/cir.png'), 0, 0, 64 * scX, 65 * scX);

            //添加游戏图标
            let userImg: Laya.Sprite = new Laya.Sprite();
            userImg.width = 65 * scX;
            userImg.height = 65 * scX;
            // userImg.graphics.drawTexture(Laya.loader.getRes('img/home/startBg.jpg'), 0, 0, 80 * scX, 80 * scX);
            userImg.loadImage(`ranking/close.png`);
            imgBox.pos(70 * scX, (listItem.height - opacImg.height) / 2);

            imgBox.addChild(opacImg);
            imgBox.addChild(userImg);
            imgBox.mask = opacImg;
            listItem.addChild(imgBox);
            let nickName: Laya.Text = new Laya.Text();
            let userNameLen: any = '哈哈哈哈哈哈啊哈哈'.toString().length > 6 ? '哈哈哈哈哈哈啊哈哈'.substring(0, 6) + '...' : '哈哈哈哈哈哈啊哈哈';
            nickName.text = `${userNameLen}`;
            nickName.color = '#fff';
            nickName.fontSize = 26 * scX;
            nickName.pos(imgBox.x + opacImg.width + 10 * scX, (listItem.height - nickName.height) / 2);
            listItem.addChild(nickName);

            //添加分数
            let score: Laya.Text = new Laya.Text();
            score.text = `888关`;
            score.align = 'right';
            score.color = '#fff';
            score.fontSize = 28 * scX;
            score.pos(listItem.width - score.width - 15 * scX, (listItem.height - score.height) / 2)
            listItem.addChild(score);

            //添加底部线条
            let line: Laya.Sprite = this.getImage('ranking/line.png', 433 * scX, 3 * scX, (listItem.width - 433 * scX) / 2, listItem.height + 1.5 * scX);
            listItem.addChild(line);

            //添加透明层
            let mask: Laya.Sprite = this.getImage('ranking/mask.png', 421 * scX, 79 * scX, (listItem.width - 421 * scX) / 2, (listItem.height - 79 * scX) / 2);
            mask.zOrder = 5;
            listItem.addChild(mask);

            data.push(listItem);
        }
        layaList.array = data;
        spriteBox.pos((this.rbg.width - 450 * scX) / 2, 155 * scX);
        //添加最后一个元素
        let listItem: Laya.Sprite = new Laya.Sprite();
        listItem.width = 450 * scX;
        listItem.height = 90 * scX;
        listItem.pos(0, 540 * scX);
        listItem.graphics.drawTexture(Laya.loader.getRes('ranking/list.png'), 0, 0, 450 * scX, 90 * scX);
        var rankNum: any;
        let my: number = 6
        if (my == 0) {
            rankNum = new Laya.Sprite();
            rankNum.width = 52 * scX;
            rankNum.height = 58 * scX;
            rankNum.graphics.drawTexture(Laya.loader.getRes('ranking/gold.png'), 0, 0, 52 * scX, 58 * scX);
        } else if (my == 1) {
            rankNum = new Laya.Sprite();
            rankNum.width = 58 * scX;
            rankNum.height = 64 * scX;
            rankNum.graphics.drawTexture(Laya.loader.getRes('ranking/yin.png'), 0, 0, 58 * scX, 64 * scX);
        } else {
            rankNum = new Laya.Text();
            rankNum.text = `666`;
            rankNum.color = '#fcd26f';
            rankNum.fontSize = 26 * scX;
        }
        rankNum.pos((75 * scX - rankNum.width) / 2, (listItem.height - rankNum.height) / 2);
        listItem.addChild(rankNum);

        let imgBox: Laya.Sprite = new Laya.Sprite();
        let opacImg: Laya.Sprite = new Laya.Sprite();
        opacImg.width = 64 * scX;
        opacImg.height = 65 * scX;
        opacImg.graphics.drawTexture(Laya.loader.getRes('ranking/cir.png'), 0, 0, 64 * scX, 65 * scX);

        //添加游戏图标
        let userImg: Laya.Sprite = new Laya.Sprite();
        userImg.width = 65 * scX;
        userImg.height = 65 * scX;
        // userImg.graphics.drawTexture(Laya.loader.getRes('img/home/startBg.jpg'), 0, 0, 80 * scX, 80 * scX);
        userImg.loadImage(`ranking/close.png`);
        imgBox.pos(70 * scX, (listItem.height - opacImg.height) / 2);

        imgBox.addChild(opacImg);
        imgBox.addChild(userImg);
        imgBox.mask = opacImg;
        listItem.addChild(imgBox);

        let nickName: Laya.Text = new Laya.Text();
        let userNameLen: any = '哈哈哈哈哈哈啊哈哈'.toString().length > 6 ? '哈哈哈哈哈哈啊哈哈'.substring(0, 6) + '...' : '哈哈哈哈哈哈啊哈哈';
        nickName.text = `${userNameLen}`;
        nickName.color = '#fff';
        nickName.fontSize = 26 * scX;
        nickName.pos(imgBox.x + opacImg.width + 10 * scX, (listItem.height - nickName.height) / 2);
        listItem.addChild(nickName);

        //添加分数
        let score: Laya.Text = new Laya.Text();
        score.text = `888关`;
        score.align = 'right';
        score.color = '#fff';
        score.fontSize = 28 * scX;
        score.pos(listItem.width - score.width - 15 * scX, (listItem.height - score.height) / 2)
        listItem.addChild(score);
        spriteBox.addChild(layaList);
        spriteBox.addChild(listItem);
        if (Laya.Browser.onMiniGame) {
            Laya.Browser.window.wx.hideLoading();
        }
        return spriteBox;
    }
    //好友排行
    private friendRankList(): Laya.WXOpenDataViewer {
        let wrData: any = this.rbg.getChildByName('layaList');
        let openData: any = this.rbg.getChildByName('openData');
        if (wrData != null) { wrData.visible = false; }
        if (openData != null) {
            openData.visible = true;
            return null;
        }
        if (Laya.Browser.onMiniGame) {
            let scX: number = Laya.Browser.window.scX;
            let scY: number = Laya.Browser.window.scY;
            let wx: any = Laya.Browser.window.wx;
            let openData: any = new Laya.WXOpenDataViewer();
            openData.name = 'openData';
            openData.width = 679 * scX;
            openData.height = 928 * scX;
            openData.pos((this.rbg.width - 450 * scX) / 2, 155 * scX);
            let openDataContext: any = wx.getOpenDataContext();
            openDataContext.postMessage({ action: 'ranking', gameData: [scX, '132456789'] });//第一个参数缩放比，第二个参数openid
            return openData;
        }
        return null;
    }
    private getImage(key: string, _w: number, _h: number, x: number = 0, y: number = 0): Laya.Sprite {
        let sp: Laya.Sprite = new Laya.Sprite();
        sp.width = _w;
        sp.height = _h;
        sp.graphics.drawTexture(Laya.loader.getRes(`${key}`), 0, 0, _w, _h);
        sp.pos(x, y);
        return sp;
    }
    //透明层
    private opacityBg(): Laya.Sprite {
        let opacity: Laya.Sprite = new Laya.Sprite();
        opacity.x = 0;
        opacity.y = 0;
        opacity.width = Laya.stage.width;
        opacity.height = Laya.stage.height;
        let graphics: Laya.Graphics = new Laya.Graphics();
        graphics.clear();
        graphics.save();
        graphics.alpha(0.6);
        graphics.drawRect(0, 0, this.width, this.height, '#000000');
        graphics.restore();
        opacity.graphics = graphics;
        opacity.on(Laya.Event.CLICK, this, (): any => {
            return false;
        })
        this.addChild(opacity);
        return opacity;
    }
    //复活界面
    public alivePopup():void{
        let aliveOpac=this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let aliveBg:Laya.Sprite = this.getImage('alive/aliveBg.png', 669 * scX, 740 * scX, (aliveOpac.width - 669 * scX) / 2, (aliveOpac.height - 700 * scX) / 2);

        //添加道具
        let gift1:Laya.Sprite=this.getImage('alive/cz.png', 179 * scX, 169 * scX,115 * scX, 230 * scX);
        gift1.on(Laya.Event.CLICK,this,e=>{
            console.log('垂子')    
        })
        let gitf1Num:Laya.Text=new Laya.Text();
        gitf1Num.text=`数量：88`;
        gitf1Num.fontSize=26*scX;
        gitf1Num.color='#fff';
        gitf1Num.pos(gift1.x+(gift1.width-gitf1Num.width)/2,gift1.y+gift1.height);

        aliveBg.addChild(gift1);
        aliveBg.addChild(gitf1Num);

        let gift2:Laya.Sprite=this.getImage('alive/bs.png', 164 * scX, 164 * scX,405 * scX, 235 * scX);
        gift2.on(Laya.Event.CLICK,this,e=>{
            console.log('不知道是傻子')    
        })
        let gitf2Num:Laya.Text=new Laya.Text();
        gitf2Num.text=`数量：88`;
        gitf2Num.fontSize=26*scX;
        gitf2Num.color='#fff';
        gitf2Num.pos(gift2.x+(gift2.width-gitf2Num.width)/2,gift2.y+gift2.height);

        aliveBg.addChild(gift2);
        aliveBg.addChild(gitf2Num);

        let gift3:Laya.Sprite=this.getImage('alive/reset.png', 173 * scX, 173 * scX,118 * scX, 420 * scX);
        gift3.on(Laya.Event.CLICK,this,e=>{
            console.log('重置')    
        })
        let gitf3Num:Laya.Text=new Laya.Text();
        gitf3Num.text=`数量：88`;
        gitf3Num.fontSize=26*scX;
        gitf3Num.color='#fff';
        gitf3Num.pos(gift3.x+(gift3.width-gitf3Num.width)/2,gift3.y+gift3.height);

        aliveBg.addChild(gift3);
        aliveBg.addChild(gitf3Num);

        let gift4:Laya.Sprite=this.getImage('alive/star.png', 173 * scX, 173 * scX,400 * scX, 420 * scX);
        gift4.on(Laya.Event.CLICK,this,e=>{
            console.log('流行')    
        })
        let gitf4Num:Laya.Text=new Laya.Text();
        gitf4Num.text=`数量：88`;
        gitf4Num.fontSize=26*scX;
        gitf4Num.color='#fff';
        gitf4Num.pos(gift4.x+(gift4.width-gitf4Num.width)/2,gift4.y+gift4.height);

        aliveBg.addChild(gift4);
        aliveBg.addChild(gitf4Num);


        //看视频复活
        let aliveBtn:Laya.Sprite=this.getImage('alive/vAlive.png', 170 * scX, 68 * scX,(aliveBg.width-170*scX)/2,aliveBg.height-68 * scX/2);
        aliveBtn.on(Laya.Event.CLICK,this,e=>{
            console.log('复活')    
        })
        //跳过
        let jumpBtn:Laya.Sprite=this.getImage('alive/jump.png', 142 * scX, 25 * scX,(aliveBg.width-142*scX)/2,aliveBg.height+aliveBtn.height*1.5);
        jumpBtn.on(Laya.Event.CLICK,this,e=>{
            console.log('跳过')    
        })
        jumpBtn.alpha=.6;

        let close: Laya.Sprite = this.getImage('ranking/close.png', 76 * scX, 62 * scX, aliveBg.width - 76 * scX, 100* scX );
        close.zOrder = 1;
        close.on(Laya.Event.CLICK, this, () => {
            this.removeSelf();
        });

        aliveBg.addChild(close);
        aliveBg.addChild(aliveBtn);
        aliveBg.addChild(jumpBtn);

        aliveOpac.addChild(aliveBg);
        this.addChild(aliveOpac);
    }
    //获得道具界面
    public getProp():void{
        let giftOpac=this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg:Laya.Sprite = this.getImage('prop/propBg.png', 639 * scX, 691 * scX, (giftOpac.width - 639 * scX) / 2, (giftOpac.height - 691 * scX) / 2);

        //添加道具
        let prop:Laya.Sprite=this.getImage('prop/gcz.png', 241 * scX, 241 * scX,125*scX,315*scX);
        //添加数量
        let propNum:Laya.Text=new Laya.Text();
        propNum.text=`88`;
        propNum.fontSize=78*scX;
        propNum.color='#fff';
        propNum.pos(400*scX,410*scX);
        //领取按钮
        let getGift: Laya.Sprite = this.getImage('prop/get.png', 178 * scX, 71 * scX, (giftBg.width - 178 * scX)/2, giftBg.height-91* scX );
        getGift.on(Laya.Event.CLICK, this, () => {
            console.log('领取礼物')
        });
        let close: Laya.Sprite = this.getImage('ranking/close.png', 76 * scX, 62 * scX, giftBg.width - 76 * scX, 100* scX );
        close.zOrder = 1;
        close.on(Laya.Event.CLICK, this, () => {
            this.removeSelf();
        });
        giftBg.addChild(close);
        giftBg.addChild(prop);
        giftBg.addChild(propNum);
        giftBg.addChild(getGift);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
    }
    //每日礼包
    public getDayGift():void{
        let giftOpac=this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg:Laya.Sprite = this.getImage('dayGift/giftBg.png', 669 * scX, 800 * scX, (giftOpac.width - 669 * scX) / 2, (giftOpac.height - 800 * scX) / 2);
       
        //领取按钮
        let getGift: Laya.Sprite = this.getImage('dayGift/get.png', 167 * scX, 75 * scX, (giftBg.width - 167 * scX)/2, giftBg.height-100* scX );
        getGift.on(Laya.Event.CLICK, this, () => {
            console.log('领取礼物')
        });
        let close: Laya.Sprite = this.getImage('ranking/close.png', 76 * scX, 62 * scX, giftBg.width - 76 * scX, 155* scX );
        close.zOrder = 1;
        close.on(Laya.Event.CLICK, this, () => {
            this.removeSelf();
        });
        giftBg.addChild(close);
        giftBg.addChild(getGift);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
    }
    //邀请奖励
    public invGift():void{
        let giftOpac=this.opacityBg();
        //添加背景
        let scX: number = Laya.Browser.window.scX;
        let giftBg:Laya.Sprite = this.getImage('inv/invBg.png', 669 * scX, 1055 * scX, (giftOpac.width - 669 * scX) / 2, (giftOpac.height - 1055 * scX) / 2);
        //添加中部list
        let invList: Laya.List = new Laya.List();
        invList.itemRender = ItemInv; //必须设置，这个类代表更新时候的处理
        invList.repeatX = 1;
        invList.repeatY = 7; //y轴个数
        invList.name= 'ingList';
        invList.x = (giftBg.width - 445*scX) / 2;
        invList.y = 260 * scX;
        invList.height=600*scX;
        invList.width=445*scX;
        // 使用但隐藏滚动条
        invList.vScrollBarSkin = "";
        invList.selectEnable = true;
        let data: Array<any> = [];
        for (let i: number = 0; i < 100; ++i) {
            //添加背景
            let listItem: Laya.Sprite = new Laya.Sprite();
            listItem.width = 445 * scX;
            listItem.height = 85 * scX;
            listItem.pos(0, i * 15);
            listItem.graphics.drawTexture(Laya.loader.getRes('inv/opac.png'), 0, 0, 445 * scX, 85 * scX);
            //添加头像
            let imgBox: Laya.Sprite = new Laya.Sprite();
            let opacImg: Laya.Sprite = new Laya.Sprite();
            opacImg.width = 64 * scX;
            opacImg.height = 65 * scX;
            opacImg.graphics.drawTexture(Laya.loader.getRes('inv/cir.png'), 0, 0, 64 * scX, 65 * scX);
            let userImg: Laya.Sprite = new Laya.Sprite();
            userImg.width = 65 * scX;
            userImg.height = 65 * scX;
            // userImg.graphics.drawTexture(Laya.loader.getRes('inv/d.png'), 0, 0, 80 * scX, 80 * scX);
            userImg.loadImage(`inv/d.png`);
            imgBox.pos(10 * scX, (listItem.height - opacImg.height) / 2);

            imgBox.addChild(opacImg);
            imgBox.addChild(userImg);
            imgBox.mask = opacImg;
            listItem.addChild(imgBox);
            //添加文字
            let nickName: Laya.Text = new Laya.Text();
            let userNameLen: any = '哈哈哈哈哈哈啊哈哈'.toString().length > 6 ? '哈哈哈哈哈哈啊哈哈'.substring(0, 6) + '...' : '哈哈哈哈哈哈啊哈哈';
            nickName.text = `${userNameLen}`;
            nickName.color = '#fff';
            nickName.fontSize = 28 * scX;
            nickName.pos(imgBox.x + opacImg.width + 10 * scX, imgBox.y);
            listItem.addChild(nickName);
            //需要邀请的人数
            let invNum: Laya.Text = new Laya.Text();
            invNum.text = `人数：${i+1}`;
            invNum.color = '#fff';
            invNum.fontSize = 24 * scX;
            invNum.pos(imgBox.x + opacImg.width + 10 * scX, imgBox.y+opacImg.height-invNum.height);
            listItem.addChild(invNum);

            let zs: Laya.Sprite = new Laya.Sprite();
            zs.width = 36 * scX;
            zs.height = 34 * scX;
            zs.graphics.drawTexture(Laya.loader.getRes('inv/zs.png'), 0, 0, 36 * scX, 34 * scX);
            zs.pos(invNum.x+invNum.width+10*scX,invNum.y-invNum.height/4);
            listItem.addChild(zs);

            //根据算法去计算
            let zsNum: Laya.Text = new Laya.Text();
            zsNum.text = `* ${(i+1)*10}`;
            zsNum.color = '#fff';
            zsNum.fontSize = 34 * scX;
            zsNum.pos(zs.x+zs.width+10*scX, zs.y);
            listItem.addChild(zsNum);
            //需要判断按钮是哪个状态
            let invBtn: Laya.Sprite = new Laya.Sprite();
            invBtn.width = 99 * scX;
            invBtn.height = 40 * scX;
            invBtn.name='invBtn';
            invBtn.graphics.drawTexture(Laya.loader.getRes('inv/invget.png'), 0, 0, 99 * scX, 40 * scX); //invget,mget,yget
            invBtn.pos(listItem.width - invBtn.width - 15 * scX,(listItem.height - invBtn.height/1.2) / 2);
            // invBtn.on(laya.events.Event.CLICK,this,()=>{
            //     console.log('处理逻辑。领取邀请等')
            // });
            listItem.addChild(invBtn);
            //添加底部线条
            let line: Laya.Sprite = this.getImage('inv/line.png', 446 * scX, 3 * scX, (listItem.width - 446 * scX+12*scX) / 2, listItem.height + 1.5 * scX);
            listItem.addChild(line);
            data.push(listItem);
        }

        invList.array = data;
        invList.selectHandler=new Laya.Handler(this,this.selectSub);
        invList.renderHandler=new Laya.Handler(this, this.onListRender);
        let close: Laya.Sprite = this.getImage('ranking/close.png', 76 * scX, 62 * scX, giftBg.width - 76 * scX, 115* scX );
        close.on(Laya.Event.CLICK, this, () => {
            this.removeSelf();
        });
        giftBg.addChild(close);
        giftBg.addChild(invList);
        giftOpac.addChild(giftBg);
        this.addChild(giftOpac);
    }
    private selectSub():void{
        console.log(123456456)
    }
    //监听更新
    private onListRender(item:any, index:number):void{
        //第一次点击无效
        let invBtn:any=item.getChildByName('invBtn');
        invBtn.off(Laya.Event.CLICK,this,this.onInvBtnClick,[index]);
	    invBtn.on(Laya.Event.CLICK,this,this.onInvBtnClick,[index]); //监听点击并且传递参数
    
    }
    private onInvBtnClick(index:number):void{
        alert("你点击了第："+index+"个btn");
    }
}