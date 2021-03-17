// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

const TITLE: string =
  "欢迎来到中国古典建筑园林的世界，跟随光标的指示，一起来探索吧。";

const CONFIG_TXT_LIST = [
  {
    txt:
      "庭院式组群布局，木结构建筑，屋檐形成如鸟翼伸展的檐角，又有隔离其他景色的的作用。",
  },
  {
    txt: "树木对创造园林的气氛尤为重要，形成古朴幽深的意境。",
  },
  {
    txt: "多见于南方园林，增添园内景色，扩大空间。",
  },
  {
    txt: "无水不活，静态水景为主，以水为中心建造园景。",
  },
  {
    txt: "荷花。水与花卉、假山石相结合，体现园林的意境美。",
  },
];

@ccclass
export default class Game extends cc.Component {
  @property(cc.Node)
  arrows: cc.Node = null;
  @property(cc.Node)
  borders: cc.Node = null;
  @property(cc.Node)
  bubble: cc.Node = null;
  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Node)
  mainBg: cc.Node = null;
  private _curData = null;
  private _canStart: boolean = false;
  private _isOver: boolean = false;
  private _remainCount: number = CONFIG_TXT_LIST.length;
  onLoad() {
    this.printTitleEff(() => {
      this._canStart = true;
    });
    this.onShowBubble(false);

    this.bubble.getChildByName("mask").on(
      "touchend",
      () => {
        this.onShowBubble(false);
        if (!this._isOver) {
          this._remainCount--;
          if (this._remainCount <= 0) {
            this._isOver = true;
            this.borders.active = false;
            this.bubble.active = false;
            this.title.node.active = true;
            this.title.node.scale = 0;
            this.title.node.getChildByName("arrow").active = false;
            this._fadeOutMainBg();
            this.title.string =
              "恭喜你顺利通过了园林探索，中国古典园林追求 “诗情画意”的审美境界。将自然美和建筑美融合在一起，将山水、花木和亭台楼阁、厅堂廊树等巧妙地结合起来，形成了鲜明而独特的艺术风格。";
            cc.tween(this.title.node)
              .to(2, { scale: 1 }, { easing: "bounceOut" })
              .delay(5)
              .call(() => {
                this.title.string = "";
                this.borders.active = true;
                this._fadeInMainBg();
              })
              .start();
          }
        }
      },
      this
    );

    this.arrows.children.forEach((arrow) => {
      cc.tween(arrow)
        .repeatForever(
          cc.tween().by(0.2, { y: -25 }).delay(1).by(0.2, { y: 25 })
        )
        .start();
    });
  }

  printTitleEff(callback: Function = null) {
    const charList = TITLE.split("");
    let id: number = 0;
    this.schedule(() => {
      id++;
      if (id > charList.length) {
        this.unscheduleAllCallbacks();
        callback && callback();
        const arrow = this.title.node.getChildByName("arrow");
        cc.tween(arrow)
          .repeatForever(cc.tween().by(0.5, { y: 25 }).by(0.5, { y: -25 }))
          .start();
      } else {
        this.title.string = charList.slice(0, id).join("");
      }
    }, 0.3);
  }

  onClickStart() {
    if (!this._canStart) {
      return;
    }
    this.title.node.active = false;
    this._fadeInMainBg(() => {
      this.scheduleOnce(() => {
        this.arrows.active = true;
      }, 0.5);
    });
  }
  _fadeInMainBg(callback: Function = null) {
    cc.tween(this.mainBg)
      .to(2, { color: cc.Color.WHITE })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  _fadeOutMainBg() {
    cc.tween(this.mainBg)
      .to(1, { color: new cc.Color().fromHEX("#737373") })
      .start();
  }

  onClickItem(evt, parm) {
    cc.Tween.stopAllByTarget(evt.target);
    const id = Number(parm);
    this.arrows.children[id].active = false;
    this.borders.children[id].getComponent(cc.Sprite).enabled = true;
    this._curData = CONFIG_TXT_LIST[id];
    this.onShowBubble(true, id);
  }

  onShowBubble(enable: boolean, id: number = -1) {
    this.bubble.active = enable;
    if (enable) {
      if (this._curData) {
        cc.Tween.stopAllByTarget(this.bubble);
        const bubbleBg = this.bubble.getChildByName("bg");
        let pos = cc.Vec2.ZERO;
        switch (id) {
          case 0:
            pos = cc.v2(223, -86);
            break;
          case 1:
            pos = cc.v2(0, 0);
            break;
          case 2:
            pos = cc.v2(254, 50);
            break;
          case 3:
            pos = cc.v2(300, -56);
            break;
          case 4:
            pos = cc.v2(342, -30);
            break;
        }
        bubbleBg.setPosition(pos);
        bubbleBg.scale = 0;
        cc.tween(bubbleBg)
          .to(0.8, { scale: 0.5 }, { easing: "bounceOut" })
          .start();

        const label = this.bubble.getChildByName("bg").getChildByName("label");
        label.getComponent(cc.Label).string = this._curData.txt;
      }
    }
  }
}
