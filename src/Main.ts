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
	private te: number = 0;  //记录动画数量
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
		let _w: number = Laya.Browser.window.innerWidth;
		let _h: number = Laya.Browser.window.innerHeight;
		Laya.Browser.window.scX = _w / 375;
		Laya.Browser.window.scY = _h / 667;
		//重置宽高
		Laya.stage.width = 375 * Laya.Browser.window.scX * 2;
		Laya.stage.height = 667 * Laya.Browser.window.scY * 2;
		Laya.stage.bgColor = '#ffffff';
		Laya.stage.size(Laya.stage.width, Laya.stage.height)
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
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, null));
		var sourceArr: Array<any> = [
			{ url: "GameScene/LoadScene.json", type: Laya.Loader.JSON },
			{ url: 'res/atlas/load.atlas', type: Laya.Loader.ATLAS }, //图集加载时这两个文件，不是图片
			{ url: 'load/startBg.jpg', type: Laya.Loader.IMAGE },
			{ url: 'load/loadActive.png', type: Laya.Loader.IMAGE },
			{ url: 'load/loadActive1.png', type: Laya.Loader.IMAGE },
			{ url: 'load/loadDefault.png', type: Laya.Loader.IMAGE },
		];
		//加载加载界面资源，防止黑屏
		Laya.loader.load(sourceArr, null, Laya.Handler.create(this, (e: Laya.Event): void => {
			this.onProgress(e);
		}, null, false));
	}
	private onProgress(pros: any): void {
		let nowLoad: number = pros * 100; //根据回调，进行百分比计算
		if (nowLoad == 100) this.onConfigLoaded();  //加载完成后进入加载界面
	}
	onConfigLoaded(): void {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		//小游戏处理暂停
		if (Laya.Browser.onMiniGame) {
			Laya.Browser.window.wx.onShow(function () {
				Laya.timer.scale = 1;
			})
			Laya.Browser.window.wx.onHide(function () {
				Laya.timer.scale = 0;
			})
		}
		let scene:Laya.Scene=new Laya.Scene();
		//创建这个场景,分离模式这样使用
		scene.loadScene('GameScene/LoadScene.scene');
		//分离模式
		Laya.stage.addChild(scene);
		// this.initRoleBox();
	}
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
		this.delRandom(10)
	}
	//产生10行10列，必须要保证是偶数的
	private initStarArray(): void {
		let m: number = 0, o1: number = 0, o2: number = 0, o3: number = 0, o4: number = 0, o5: number = 0;
		let colorsArr: Array<any> = []; //产生一个颜色均为偶数的数组
		for (let i: number = 0; i < this.row; ++i) {
			colorsArr[i] = [];
			for (let j: number = 0; j < this.clos; ++j) {
				let rnd: number = this.randomNum(1, 5);
				colorsArr[i][j] = rnd;
				// m++;
				// //超过95
				// if (m > 95) {
				// 	if (o1 % 2 != 0) {
				// 		colorsArr[i][j] = 1;
				// 		o1++;
				// 	} else if (o2 % 2 != 0) {
				// 		colorsArr[i][j] = 2;
				// 		o2++;
				// 	} else if (o3 % 2 != 0) {
				// 		colorsArr[i][j] = 3;
				// 		o3++;
				// 	} else if (o4 % 2 != 0) {
				// 		colorsArr[i][j] = 4;
				// 		o4++;
				// 	} else if (o5 % 2 != 0) {
				// 		colorsArr[i][j] = 5;
				// 		o5++;
				// 	} else {
				// 		let rnd: number = this.randomNum(1, 5);
				// 		colorsArr[i][j] = rnd;
				// 		switch (rnd) {
				// 			case 1:
				// 				o1++;
				// 				break;
				// 			case 2:
				// 				o2++;
				// 				break;
				// 			case 3:
				// 				o3++;
				// 				break;
				// 			case 4:
				// 				o4++;
				// 				break;
				// 			case 5:
				// 				o5++;
				// 				break;
				// 		}
				// 	}
				// } else {
				// 	let rnd: number = this.randomNum(1, 5);
				// 	colorsArr[i][j] = rnd;
				// 	switch (rnd) {
				// 		case 1:
				// 			o1++;
				// 			break;
				// 		case 2:
				// 			o2++;
				// 			break;
				// 		case 3:
				// 			o3++;
				// 			break;
				// 		case 4:
				// 			o4++;
				// 			break;
				// 		case 5:
				// 			o5++;
				// 			break;
				// 	}
				// }
				//初始化角色列
				// let sp: any = new Laya.Sprite();
				// sp.loadImage(`images/${this.IMGARR[rnd - 1]}.png`);
				// sp.width = 56 * Laya.Browser.window.scX;
				// sp.height = 51 * Laya.Browser.window.scX;
				// sp.index = m++;
				// sp.pos((this.rowWidth() - sp.width) / 2 + this.rowWidth() * i, -(this.row - j) * this.rowWidth());
				// sp.on(Laya.Event.CLICK, this, this.roleClick); //添加元素点击事件
				// Laya.Tween.to(sp, { y: (this.rowWidth() - sp.height) / 2 + this.rowWidth() * j }, 1000, Laya.Ease.elasticOut, Laya.Handler.create(this, e => {

				// }), j * 30);
				// this.roleBox.addChild(sp);
			}
		}
		//随机排序二维数组
		this.starArr = this.sortDoubleArr(colorsArr);
		//添加角色
		this.addRole(this.starArr);
	}
	//添加角色
	private addRole(arr: Array<any>, r: boolean = false): void {
		let m: number = 0;
		for (let i: number = 0; i < arr.length; ++i) {
			for (let j: number = 0; j < arr[0].length; ++j) {
				if (arr[i][j] != 0) {
					//初始化角色列
					let sp: any = new Laya.Sprite();
					sp.width = 70 * Laya.Browser.window.scX;
					sp.height = 76 * Laya.Browser.window.scX;
					sp.loadImage(`images/${this.IMGARR[arr[i][j] - 1]}.png`);
					// sp.graphics.drawTexture(Laya.loader.getRes(`images/${this.IMGARR[arr[i][j] - 1]}.png`), 0, 0, 70 * Laya.Browser.window.scX,76 * Laya.Browser.window.scX);
					sp.index = m;
					sp.name = `role${m}`;
					sp.on(Laya.Event.CLICK, this, this.roleClick); //添加元素点击事件
					if (!r) {
						sp.pos((this.rowWidth() - sp.width) / 2 + this.rowWidth() * i, -(arr.length - j) * this.rowWidth());
						Laya.Tween.to(sp, { y: (this.rowWidth() - sp.height) / 2 + this.rowWidth() * j }, 1000, Laya.Ease.elasticOut, Laya.Handler.create(this, e => {
						}), j * 30);
					} else {
						sp.pos((this.rowWidth() - sp.width) / 2 + this.rowWidth() * i, (this.rowWidth() - sp.height) / 2 + this.rowWidth() * j);
					}
					this.roleBox.addChild(sp);
				}
				m++
			}
		}
	}
	//星星点击操作，在每一个消除星星处都要播放一个动画
	private roleClick(e: Laya.Event): void {
		if (this.gameEnd) return;
		this.gameEnd = true;
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
			let position: any = this.getPos(i);  //获取坐标位置
			if (!this.starArr[position.x][position.y]) continue; // 已经消去的，跳过
			let position1: any = this.getPos(i - 1);  //获取坐标位置
			let position2: any = this.getPos(i + 1);  //获取坐标位置
			let position3: any = this.getPos(i - 10);  //获取坐标位置
			let position4: any = this.getPos(i + 10);  //获取坐标位置
			if (position.y > 0 && this.starArr[position1.x][position1.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			//向下查找没问题
			if (position.y < 9 && this.starArr[position2.x][position2.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.x > 0 && this.starArr[position3.x][position3.y] == this.starArr[position.x][position.y]) {
				return false;
			}
			if (position.x < 9 && this.starArr[position4.x][position4.y] == this.starArr[position.x][position.y]) {
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
	//随机删除
	private delRandom(delNum: number): void {
		let delArr: Array<any> = [];
		for (let i: number = 0; i < delNum; ++i) {
			let rnd: number = this.randomNum(0, this.roleBox._children.length - 1); //随机获取一个
			if (delArr.indexOf(rnd) != -1) {
				while (true) { //已经有了，再次循环
					let rnd: number = this.randomNum(0, this.roleBox._children.length - 1); //随机获取一个
					if (delArr.indexOf(rnd) == -1) {
						delArr.push(rnd);
						break;
					}
				}
			} else {
				delArr.push(rnd);
			}
		}
		//根据delArr去获取元素
		this.commStar = [];
		for (let i: number = 0; i < delArr.length; ++i) {
			let role: any = this.roleBox.getChildAt(delArr[i]);
			this.commStar.push(role.index);
		}
		//直接删除
		this.clearStar(this.commStar);
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
		if (clearArr.length < 2) { this.gameEnd = false; this.clearRoleSelect(); return; }
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
			//刷新
			setTimeout(() => {
				// this.refresh();
				this.moveDown();
				this.moveLeft();
			}, 500);

		}, 1000);

	}
	//向下移动
	private moveDown(type: boolean = true): void {
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
						if (type) this.moveRole(j, j + c, 1);
					}
			}
		}
		setTimeout(() => {
			if (this.gameOver()) {
				this.roleBox.removeChildren();
				//重新初始化游戏
				this.initStarArray();
			} else {
				this.gameEnd = false;
			}
		}, 120);
	}
	//移动角色
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
				this.roleBox._children[i].name = `role${e}`;
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
	}
	//二维数组随机排序
	private sortDoubleArr(arr: Array<any>): Array<any> {
		let starArrOne: Array<any> = this.flatten(arr);  //将数组转为一维数组
		starArrOne.sort(function () { return 0.5 - Math.random(); }); //随机排序
		//循环二维数组,替换数组
		let m: number = 0;
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				if (arr[i][j] != 0) { arr[i][j] = starArrOne[m]; m++; } //替换
			}
		}
		return arr;
	}
	//洗牌操作
	private refresh(): void {
		//随机排列数组
		//先将数组转化为一维数组
		//由于消除后，为0了，那么不能包含0
		let m: number = 0;
		//根据元素位置去刷新
		let starArrIndex: Array<any> = [];  //记录元素的位置
		for (let i: number = 0; i < this.roleBox._children.length; ++i) {
			starArrIndex.push(this.roleBox._children[i].index);
		}
		//排序
		starArrIndex.sort(function () { return 0.5 - Math.random(); }); //随机排序
		let starArrOne: Array<any> = this.flatten(this.starArr);
		//转为一维数组
		for (let i = 0; i < starArrOne.length; ++i) {
			if (starArrOne[i] != 0) {
				let t: number = starArrOne[i];
				starArrOne[i] = starArrOne[starArrIndex[m]];
				starArrOne[starArrIndex[m]] = t;
				m++;
			}
		}
		m = 0;
		//位置排序以后重新设置二维数组
		for (let i: number = 0; i < this.row; ++i) {
			for (let j: number = 0; j < this.clos; ++j) {
				this.starArr[i][j] = starArrOne[m];
				m++;
			}
		}
		//检查是否结束
		if (this.gameOver()) {
			this.refresh(); //重复
		} else {
			m = 0;
			this.te = 0;
			//更新元素位置,需要更新name，index，但是不能同步更新，那样会存在错误
			for (let i: number = 0; i < this.row; ++i) {
				for (let j: number = 0; j < this.clos; ++j) {
					if (this.starArr[i][j] != 0) {
						let child: any = this.roleBox.getChildByName(`role${starArrIndex[m]}`);  //获取到元素
						Laya.Tween.to(child, {
							x: (this.rowWidth() - child.width) / 2 + i * this.rowWidth(),
							y: (this.rowWidth() - child.height) / 2 + j * this.rowWidth(), update: Laya.Handler.create(this, e => {
							})
						}, 100, Laya.Ease.linearOut, Laya.Handler.create(this, e => {
							this.te++;
						}), 0)
						m++;
					}
				}
			}
			m = 0;
			Laya.timer.loop(1, this, this.exchangeRoleBox);
		}
	}
	private exchangeRoleBox(): void {
		if (this.te == this.roleBox._children.length) {
			this.te = 0;
			this.clearTimer();
			this.roleBox.removeChildren();
			this.addRole(this.starArr, true);
		}
	}
	private clearTimer(): void {
		Laya.timer.clear(this, this.exchangeRoleBox);
	}
	//将二维数组转为一维数组
	private flatten(arr: Array<any>): Array<any> { return [].concat(...arr.map(x => Array.isArray(x) ? this.flatten(x) : x)) }
	//所有星星向左移动
	private moveLeft(type: boolean = true): void {
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

				this.moveLeftLine(i, line, type);
			}
		}
	}
	//正规向左移动
	private moveLeftLine(index: number, line: number, type: boolean): void {
		//移动元素
		for (var j: number = 9 + index * 10; j >= index * 10; j--) {
			let position1: any = this.getPos(j - line * 10);
			let position: any = this.getPos(j);
			this.starArr[position1.x][position1.y] = this.starArr[position.x][position.y];//重置移动后的星星数组值
			this.starArr[position.x][position.y] = 0;
			if (type) this.moveRole(j, j - line * 10, 2);
		}
		setTimeout(() => {
			if (this.gameOver()) {
				console.log('游戏结束');
				this.roleBox.removeChildren();
				//重新初始化游戏
				this.initStarArray();
			} else {
				this.gameEnd = false;
			}
		}, 120);
	}
	//获取随机数
	public randomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}
//激活启动类
new Main();
