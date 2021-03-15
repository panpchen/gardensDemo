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
  private _curData = null;

  onLoad() {
    this.onShowBubble(false);

    this.bubble.getChildByName("mask").on(
      "touchend",
      () => {
        this.onShowBubble(false);
      },
      this
    );

    this.arrows.children.forEach((arrow) => {
      cc.tween(arrow)
        .repeatForever(
          cc
            .tween()
            .parallel(
              cc.tween().by(0.2, { y: 25 }),
              cc.tween().to(0.2, { scale: 0.95 })
            )
            .parallel(
              cc.tween().by(0.2, { y: -25 }),
              cc.tween().to(0.2, { scale: 1 })
            )
            .delay(1)
        )
        .start();
    });

    this.borders.children.forEach((border) => {
      cc.tween(border)
        .repeatForever(cc.tween().to(1, { scale: 0.95 }).to(1, { scale: 1 }))
        .start();
    });

    this.printTitleEff();
  }

  printTitleEff() {
    const charList = TITLE.split("");
    let id: number = 0;
    this.schedule(() => {
      id++;
      if (id > charList.length) {
        this.unscheduleAllCallbacks();
        const arrow = this.title.node.getChildByName("arrow");
        cc.tween(arrow)
          .repeatForever(cc.tween().by(0.5, { y: 25 }).by(0.5, { y: -25 }))
          .start();
      } else {
        this.title.string = charList.slice(0, id).join("");
      }
    }, 0.2);
  }

  onClickItem(evt, parm) {
    cc.Tween.stopAllByTarget(evt.target);
    const id = Number(parm);
    this.arrows.children[id].active = false;
    this._curData = CONFIG_TXT_LIST[id];
    cc.tween(evt.target)
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
