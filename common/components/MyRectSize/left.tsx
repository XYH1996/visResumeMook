/**
 * 左侧
 */
import React from 'react';
import classnames from 'classnames';
import { setPollPromise, reducePX, transformStringToNumber } from '@common/utils';

interface IProps {
  style?: React.CSSProperties;
  boxRef?: any;
}

interface IState {
  showMenu: boolean;
  width: number;
}

class LeftComponent extends React.Component<IProps, IState> {
  isTransition: boolean;
  clearState: boolean;
  defaultRef = React.createRef();
  constructor(props: IProps) {
    super(props);
    this.state = {
      showMenu: true, // 默认菜单栏是显示状态
      width: 0,
    };
    this.isTransition = false; // 只有点击的时候才加上动画
    this.clearState = false; // 避免卸载组件时，再去执行this.setState警告问题
  }
  componentDidMount() {
    const promise = setPollPromise(
      [
        () => {
          if (
            this.boxRef.current &&
            this.boxRef.current.children &&
            this.boxRef.current.children.length > 0 &&
            this.boxRef.current.children[0].clientWidth
          ) {
            return this.boxRef.current.children[0].clientWidth;
          }
        },
        () => {
          return this.clearState;
        },
      ],
      300
    );
    promise.then((width: number | any) => {
      if (!this.clearState) {
        this.setState({ width });
      }
    });
  }
  componentWillUnmount() {
    this.clearState = true;
  }

  onChangeMenu = () => {
    this.setState((prev) => {
      return {
        showMenu: !prev.showMenu,
      };
    });
  };
  get boxRef() {
    return this.props.boxRef || this.defaultRef;
  }

  render() {
    const { showMenu, width } = this.state;
    const { style = {}, children } = this.props;
    return (
      <>
        <div ref={this.boxRef} className="left-box" style={{ width, ...style, left: showMenu ? style?.left : -width }}>
          {children}
        </div>
        <div
          className="rect-menu"
          style={{
            left: showMenu ? width + (transformStringToNumber(reducePX(style?.left)) || 0) : 0,
            transition: this.isTransition ? 'all 0.5s' : 'none',
          }}
          onClick={() => {
            this.onChangeMenu();
            this.isTransition = true;
          }}
        >
          <div
            className={classnames('rect-icon', {
              'rect-icon-hidden': !showMenu,
            })}
          />
        </div>
      </>
    );
  }
}

export default LeftComponent;
