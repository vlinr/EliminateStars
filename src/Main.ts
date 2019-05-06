import GameConfig from "./GameConfig";
class Main {
	private scene: any;
	private starArr: Array<any> = [];
	private row: number = 10;
	private clos: number = 10;
	private commStar: Array<any> = [];
	private roleBox: Laya.Sprite;
	private IMGARR: Array<any> = ['red', 'blue', 'gay', 'yellow', 'green'];
	private gameEnd: boolean = false;//是否游戏结束
	private roleArr: Array<any> = [];//角色数组
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		Laya.Browser.window.scX = 375 / Laya.Browser.width;
		Laya.stage.width = 750 * Laya.Browser.window.scX;
		Laya.stage.height = 1334 * Laya.Browser.window.scX;
		Laya.stage.bgColor = '#fff';
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		console.log('显示了')
		this.initRoleBox();
	}
	/*************正式使用**************/
	//初始化装角色的box
	private initRoleBox(): void {
		this.roleBox = new Laya.Sprite();
		let graphics = new Laya.Graphics();
		graphics.clear();
		graphics.save();
		graphics.alpha(0.6);
		graphics.drawRect(0, 0, Laya.stage.width, this.rowWidth() * 10, '#000000');
		graphics.restore();
		this.roleBox.graphics = graphics;
		this.roleBox.width = Laya.stage.width;
		this.roleBox.height = this.rowWidth() * 10;
		this.roleBox.pos(0, 0);
		Laya.stage.addChild(this.roleBox);
		this.initStarArray();
	}
	//产生10行10列
	private initStarArray(): void {
		let m: number = 0;
		for (let i: number = 0; i < this.row; ++i) {
			this.starArr[i] = [];
			this.roleArr[i] = [];  //初始化角色行
			for (let j: number = 0; j < this.clos; ++j) {
				let rnd: number = this.randomNum(1, 5);
				this.starArr[i][j] = rnd
				//初始化角色列
				let sp: any = new Laya.Sprite();
				sp.loadImage(`images/${this.IMGARR[rnd - 1]}.png`);
				sp.width = 56 * Laya.Browser.window.scX;
				sp.height = 51 * Laya.Browser.window.scX;
				sp.index = m++;
				sp.pos((this.rowWidth() - sp.width) / 2 + this.rowWidth() * i, (this.rowWidth() - sp.height) / 2 + this.rowWidth() * j);
				sp.on(Laya.Event.CLICK, this, this.roleClick); //添加元素点击事件
				this.roleBox.addChild(sp);
				this.roleArr[i][j] = sp;
			}
		}
	}

	//星星点击操作，在每一个消除星星处都要播放一个动画
	private roleClick(e: Laya.Event): void {
		if (this.gameEnd) return;
		this.gameEnd=true;
		let events: any = e.target;
		this.commStar = [];
		this.getCommStar(events.index);
		//下一步消除元素
		this.clearStar(this.commStar);
	}
	private rowWidth(): number {
		return Laya.stage.width / 10;
	}
	//判断游戏是否结束
	private gameOver(): boolean {//坐标转换有问题
		for (var i = 0; i < 100; i++) {
			if (!this.starArr[i]) continue; // 已经消去的，跳过
			let position: any = this.getPos(i);  //获取坐标位置
			let position1: any = this.getPos(i - 1);  //获取坐标位置
			let position2: any = this.getPos(i + 1);  //获取坐标位置
			let position3: any = this.getPos(i - 10);  //获取坐标位置
			let position4: any = this.getPos(i + 10);  //获取坐标位置
			if (position.x > 0 && this.starArr[position3.x][position3.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.x < 9 && this.starArr[position4.x][position4.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.y > 0 && this.starArr[position1.x][position1.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.y < 9 && this.starArr[position2.x][position2.y] == this.starArr[position.x][position.y]) {
				return false;
			}
		}
		return true;
	}
	//转换为对应二维数组坐标
	private getPos(index: number): any {
		return { x: Math.floor(index / this.row), y: index % this.row }; // game.row =10 
	}
	//获取相同的星星的集合
	private getCommStar(index: number): void {
		this.commStar.push(index);  //存储进去
		// game.getImg(index).className = "on"; //设置亮图
		this.setRoleSelect(index);
		let position: any = this.getPos(index);  //获取坐标位置
		let position1: any = this.getPos(index - 1);  //获取坐标位置
		let position2: any = this.getPos(index + 1);  //获取坐标位置
		let position3: any = this.getPos(index - 10);  //获取坐标位置
		let position4: any = this.getPos(index + 10);  //获取坐标位置
		//判断四个方向是否有相同的颜色，而且不存在commStar数组中
		//首先把index传入数组存储，index也就是元素的具体位置0~99,
		//然后根据上下左右去递归
		//上,首先需要判断是否已经在数组中，人后在判断是否两个颜色一致，一致则继续递归,最后需要判断是否越界了
		console.log(position.y)
		//向上查找没问题
		if (position.y > 0 && this.commStar.indexOf(index - 1) < 0 && this.starArr[position1.x][position1.y] == this.starArr[position.x][position.y]) {
			console.log('这是向上查找');
			this.getCommStar(index - 1);
		}
		//向下查找没问题
		if (position.y < 9 && this.commStar.indexOf(index + 1) < 0 && this.starArr[position2.x][position2.y] == this.starArr[position.x][position.y]) {
			console.log('这是向下查找');
			this.getCommStar(index + 1);
		}
		if (position.x > 0 && this.commStar.indexOf(index - 10) < 0 && this.starArr[position3.x][position3.y] == this.starArr[position.x][position.y]) {
			console.log('这是向左查找');
			this.getCommStar(index - 10);
		}
		if (position.x < 9 && this.commStar.indexOf(index + 10) < 0 && this.starArr[position4.x][position4.y] == this.starArr[position.x][position.y]) {
			console.log('这是向右查找');
			this.getCommStar(index + 10);
		}
	}
	//设置元素选中
	private setRoleSelect(index: number): void {
		//设置元素选中
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (this.roleBox._children[i].index == index) this.roleBox._children[i].rotation = 30;
		}
	}
	//清除元素选中
	private clearRoleSelect(): void {
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			this.roleBox._children[i].rotation = 0;
		}
	}
	//消除星星
	private clearStar(clearArr: Array<any>): void {
		//消除
		console.log(clearArr)
		if (clearArr.length < 2){this.gameEnd=false;this.clearRoleSelect();return;} 
		let removeChildArr: Array<any> = [];
		setTimeout(() => {
			for (let i: number = 0; i < this.roleBox._children.length; ++i) {
				if (clearArr.indexOf(this.roleBox._children[i].index) != -1) {
					let position: any = this.roleBox._children[i].index;
					removeChildArr.push(this.roleBox._children[i]);
					this.starArr[this.getPos(position).x][this.getPos(position).y] = 0; //设置对应的下标为0
				}
			}
			//移除
			for (let i: number = 0; i < removeChildArr.length; ++i)this.roleBox.removeChild(removeChildArr[i]);
			this.moveDown();
			this.moveLeft();
		}, 1000);

	}
	//向下移动
	private moveDown(): void {
		for (var i: number = 0; i < 10; i++)// 循环最下面一行的10列
		{
			var c = 0;// 每列被消去的星星数量
			for (var j: number = 9 + i * 10; j >= i * 10; j--) // 循环每列的10个星星
			{
				let position: any = this.getPos(j);
				if (!this.starArr[position.x][position.y]) { 
					c++;
				} else
					if (c) {
						let position1: any = this.getPos(j + c);
						this.starArr[position1.x][position1.y] = this.starArr[position.x][position.y];//重置移动后的星星数组值
						this.starArr[position.x][position.y] = 0;
						this.moveRole(j, j + c,1);
					}
			}
		}
	}
	private moveRole(s: number, e: number, type: number): void {
		//s代表开始位置，e代表结束位置
		// console.log(s,e,'开始结束位置');
		let position: any = this.getPos(s); //移动开始点
		let position1: any = this.getPos(e); //移动终点
		//如何移动，已经删除了某些元素
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			if (this.roleBox._children[i].index == s) {
				//代表当前下标相等
				this.roleBox._children[i].index = e;
				// this.roleBox._children[i].y=(this.rowWidth()-this.roleBox._children[i].height)/2+position1.y*this.rowWidth();
				if (type == 1) {
					Laya.Tween.to(this.roleBox._children[i], {
						y: (this.rowWidth() - this.roleBox._children[i].height) / 2 + position1.y * this.rowWidth(), update: Laya.Handler.create(this, e => {
						})
					}, 100, Laya.Ease.linearOut, Laya.Handler.create(this, e => {
					}), 0)
				} else {
					Laya.Tween.to(this.roleBox._children[i], {
						x: (this.rowWidth() - this.roleBox._children[i].width) / 2 + position1.x * this.rowWidth(), update: Laya.Handler.create(this, e => {
						})
					}, 100, Laya.Ease.linearOut, Laya.Handler.create(this, e => {

					}), 0)
				}
				break;
			}
		}
		setTimeout(() => {
			if(this.gameOver()){
				console.log('游戏结束');
				this.roleBox.removeChildren();
				//重新初始化游戏
				this.initStarArray();
			}else{
				this.gameEnd=false;				
			}
		}, 120);
	}
	//所有星星向左移动
	private moveLeft(): void {
		var line = 0, t = 1;// line 需要移动的列数，t 当前列是否都为0
		for (var i: number = 0; i < 10; i++) {
			t = 1;
			for (var j: number = 9 + i * 10; j >= i * 10; j--) {
				let position: any = this.getPos(j);
				if (this.starArr[position.x][position.y]) { t = 0; break; } //判断这一行是否还有物体
			}
			if (t) //当前列都为0 ,需要移动的列数+1
			{
				line++;
			} else if (line) // 当前列还有未消除的星星，且要移动的列数>0时，移动当前列
			{
				this.moveLeftLine(i, line);
			}
		}
	}
	//正规向左移动
	private moveLeftLine(index: number, line: number): void {
		//移动元素
		for (var j: number = 9 + index * 10; j >= index * 10; j--) {
			let position1: any = this.getPos(j - line*10);
			let position: any = this.getPos(j);
			this.starArr[position1.x][position1.y] = this.starArr[position.x][position.y];//重置移动后的星星数组值
			this.starArr[position.x][position.y] = 0;
			this.moveRole(j, j - line*10,2);
		}
	}
	//获取随机数
	public randomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}
//激活启动类
new Main();
