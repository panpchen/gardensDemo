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
    color: "#FFA077",
    txtColor: "#BC5022",
  },
  {
    txt: "树木对创造园林的气氛尤为重要，形成古朴幽深的意境。",
    color: "#7AFF77",
    txtColor: "#0E620C",
  },
  {
    txt: "多见于南方园林，增添园内景色，扩大空间。",
    color: "#F7FF75",
    txtColor: "#424515",
  },
  {
    txt: "无水不活，静态水景为主，以水为中心建造园景。",
    color: "#97FFFD",
    txtColor: "#0D605E",
  },
  {
    txt: "荷花。水与花卉、假山石相结合，体现园林的意境美。",
    color: "#EBC5FF",
    txtColor: "#74239F",
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
  private _remainCount: number = CONFIG_TXT_LIST.length;
  private _lastTween: cc.Tween = null;
  onLoad() {
    this.printTitleEff(() => {
      this._canStart = true;
    });
    this.onShowBubble(false);

    this.bubble.getChildByName("mask").on(
      "touchend",
      () => {
        this.onShowBubble(false);
        this._lastTween = null;
        this._remainCount--;
        if (this._remainCount <= 0) {
          // this.arrows.active = false;
          this.bubble.active = false;
          this.borders.active = false;

          this.title.node.active = true;
          this.title.node.scale = 0;
          this.title.node.getChildByName("arrow").active = false;
          this.title.string =
            "恭喜你顺利通过了园林探索，中国古典园林追求 “诗情画意”的审美境界。将自然美和建筑美融合在一起，将山水、花木和亭台楼阁、厅堂廊树等巧妙地结合起来，形成了鲜明而独特的艺术风格。";
          cc.tween(this.title.node)
            .to(2, { scale: 1 }, { easing: "bounceOut" })
            .start();
        }
      },
      this
    );

    // this.arrows.children.forEach((arrow) => {
    //   cc.tween(arrow)
    //     .repeatForever(
    //       cc
    //         .tween()
    //         .parallel(
    //           cc.tween().by(0.2, { y: 25 }),
    //           cc.tween().to(0.2, { scale: 0.95 })
    //         )
    //         .parallel(
    //           cc.tween().by(0.2, { y: -25 }),
    //           cc.tween().to(0.2, { scale: 1 })
    //         )
    //         .delay(1)
    //     )
    //     .start();
    // });

    this.borders.children.forEach((border) => {
      cc.tween(border)
        .repeatForever(cc.tween().to(1, { scale: 0.95 }).to(1, { scale: 1 }))
        .start();
    });
  }

  printTitleEff(callback: Function) {
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
        // this.arrows.active = true;
        this.borders.active = true;
      }, 0.5);
    });
  }
  _fadeInMainBg(callback: Function) {
    cc.tween(this.mainBg)
      .to(2, { color: cc.Color.WHITE })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  onClickItem(evt, parm) {
    // 初始是循环缩放效果,这里就先停止
    if (this._lastTween) {
      return;
    }
    cc.Tween.stopAllByTarget(evt.target);
    const id = Number(parm);
    // this.arrows.children[id].active = false;
    this._curData = CONFIG_TXT_LIST[id];
    this._lastTween = cc
      .tween(evt.target)
      .to(0.1, { scale: 1.1 })
      .to(0.3, { scale: 0 })
      .call(() => {
        this.onShowBubble(true);
      })
      .start();
  }
  onShowBubble(enable: boolean) {
    this.bubble.active = enable;
    if (enable) {
      if (this._curData) {
        cc.Tween.stopAllByTarget(this.bubble);
        this.bubble.scale = 0;
        const mask = this.bubble.getChildByName("mask");
        mask.opacity = 0;
        cc.tween(this.bubble)
          .to(0.8, { scale: 1 }, { easing: "bounceOut" })
          .call(() => {
            mask.opacity = 170;
          })
          .start();

        this.bubble.getChildByName("bg").color = cc
          .color()
          .fromHEX(this._curData.color);

        const label = this.bubble.getChildByName("label");
        label.color = cc.color().fromHEX(this._curData.txtColor);
        label.getComponent(cc.Label).string = this._curData.txt;
      }
    }
  }
}
