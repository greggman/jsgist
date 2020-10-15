import React from 'react';

const defaultGutterSize = 10;
const defaultDirection = 'horizontal';
const defaultMinSize = 10;

function distribute(items, buckets) {
  const base = items / buckets | 0;
  const extra = items % buckets;
  const array = new Array(buckets).fill(base);
  if (extra === 0) {
    return array;
  } else if (extra <= buckets / 2 | 0) {
    const leap = buckets / extra | 0;
    const halfLeap = leap / 2 | 0; 
    return array.map((v, i) => v + ((i % leap === halfLeap) ? 1 : 0));
  } else {
    const leap = buckets / (buckets - extra) | 0;
    const halfLeap = leap / 2 | 0;
    return array.map((v, i) => v + (1 - (i % leap === halfLeap ? 1 : 0)));
  }
}

function normalizeSizes(sizes) {
  const totalSize = sizes.reduce((sum, v) => sum + v, 0);
  return sizes.map(v => v / totalSize);
}

const getMouseOrTouchPosition = (e, clientAxis) => e.touches ? e.touches[0][clientAxis] : e[clientAxis];

function addSpaceForChildren(sizes, numChildren, gutterSize, minSizePX, totalSizePX) {
  // const numGutters = numChildren - 1;
  // const totalGutterSpacePX = numGutters * gutterSize;
  // const availableSpacePX = totalSizePX - totalGutterSpacePX;
  //
  // this is not so trivial
  // let's say we have 3 items and we add 2 more.
  // each of those 2 has a minSize. So need to take 2 * minSize
  // from the 3 items or (2 * minSize / 3). But any of those items
  // themselves might already be at or near minSize
  //
  // This seems like it's then iterative.
  //
  // go through and try to remove (minSize * numNewElements / numOldElements)
  // from each old element but only remove such that that element
  // is still >= minSize. When done there's possibly some amount
  // you haven't distributed yet so repeat the process over and over
  // until it's all distributed.
  //
  // given that we don't know which elements are new, for now
  // lets just reset all the sizes
  return new Array(numChildren).fill(1 / numChildren);
}

const getDirectionProps = direction => (direction === 'horizontal')
  ? {
      dimension: 'width',
      clientAxis: 'clientX',
      position: 'left',
      positionEnd: 'right',
      clientSize: 'clientWidth',
      style: {
        width: '100%',
        display: 'flex',
      },
    }
  : {
      dimension: 'height',
      clientAxis: 'clientY',
      position: 'top',
      positionEnd: 'bottom',
      clientSize: 'clientHeight',
      style: { /*height: '100%'*/ },
    };

function computeNewSizes({
  startSizes,
  currentSizes,
  prevPaneNdx,
  gutterSize,
  minSize,
  deltaPX,
  outerSizePX,
}) {
  const numPanes = currentSizes.length;
  const numGutters = numPanes - 1;
  const totalGutterSizePX = numGutters * gutterSize;

  const gutterReservedSizesPX = distribute(totalGutterSizePX, numPanes);

  const nextPaneNdx = prevPaneNdx + 1;
  const prevPaneStartSizePX = Math.ceil(startSizes[prevPaneNdx] * outerSizePX) - gutterReservedSizesPX[prevPaneNdx];
  const nextPaneStartSizePX = Math.ceil(startSizes[nextPaneNdx] * outerSizePX) - gutterReservedSizesPX[nextPaneNdx];
  const spaceUsedByBothElementsPX = prevPaneStartSizePX + nextPaneStartSizePX;
  const prevPaneNewSizePX = Math.min(
    Math.max(minSize, prevPaneStartSizePX + deltaPX),
    spaceUsedByBothElementsPX - minSize);
  const nextPaneNewSizePX = spaceUsedByBothElementsPX - prevPaneNewSizePX;
  const newSizes = [
    ...currentSizes.slice(0, prevPaneNdx),
    (prevPaneNewSizePX + gutterReservedSizesPX[prevPaneNdx]) / outerSizePX,
    (nextPaneNewSizePX + gutterReservedSizesPX[nextPaneNdx]) / outerSizePX,
    ...currentSizes.slice(prevPaneNdx + 2, currentSizes.length),
  ];

  /*
  const availableSpacePX = outerSizePX - totalGutterSizePX;
  const info = `
  gutterReservedSizes: ${gutterReservedSizesPX}
  availableSpacePX: ${availableSpacePX}
  prevStartSizePX: ${prevPaneStartSizePX}
  nextStartSizePX: ${nextPaneStartSizePX}
  spaceUsedByBothElementsPX: ${spaceUsedByBothElementsPX}
  prevNewSizePX: ${prevPaneNewSizePX}
  nextNewSizePX: ${nextPaneNewSizePX}
  sizes: ${currentSizes}
  newSizes: ${newSizes}
  `;
  const infoElem = document.querySelector('#info');
  infoElem.textContent = info;
  */

  return newSizes;
}

const stopMobileBrowserFromScrolling = e => e.preventDefault();

class Gutter extends React.Component {
  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
  }
  handleMouseDownAndTouchStart = (e) => {
    const {onMouseDownAndTouchStart} = this.props;
    onMouseDownAndTouchStart(e);
  }
  componentDidMount() {
    // There's no way in React 16 to add passive false event listeners
    // which means there is no way to drag a splitter and prevent mobile browsers
    // from scrolling
    const elem = this.elementRef.current;
    elem.addEventListener('mousedown', this.handleMouseDownAndTouchStart, {passive: false});
    elem.addEventListener('touchstart', this.handleMouseDownAndTouchStart, {passive: false});
  }
  componentWillUnmount() {
    const elem = this.elementRef.current;
    elem.removeEventListener('mousedown', this.handleMouseDownAndTouchStart);
    elem.removeEventListener('touchstart', this.handleMouseDownAndTouchStart);
  }
  render() {
    const {direction, dragging, current, style} = this.props;
    return (
      <div
        ref={this.elementRef}
        className={`gutter gutter-${direction} ${dragging && current ? 'gutter-dragging' : ''}`}
        style={style}
      />
    );
  }
}

export default class GManSplit extends React.Component {
  constructor(props) {
    super(props);
    const numPanes = React.Children.count(props.children);
    const size = 1 / numPanes;
    this.state = {
      sizes: new Array(numPanes).fill(size),
    };
    this.elementRef = React.createRef();
  }
  _setSizes = (sizes) => {
    this.setState({sizes});
  }
  handleMouseUpAndTouchEnd = () => {
    document.removeEventListener("mousemove", this.handleMouseAndTouchMove);
    document.removeEventListener("mouseup", this.handleMouseUpAndTouchEnd);
    document.removeEventListener("touchmove", this.handleMouseAndTouchMove);
    document.removeEventListener("touchend", this.handleMouseUpAndTouchEnd);
    this.setState({dragging: false});
  };
  handleMouseAndTouchMove = (e) => {
    stopMobileBrowserFromScrolling(e);
    const {
      gutterSize = defaultGutterSize,
      direction = defaultDirection,
      minSize = defaultMinSize,
      computeNewSizesFn = computeNewSizes,
      onSetSizes,
      sizes: propSizes,
    } = this.props;
    const {
      prevPaneNdx,
      mouseStart,
      startSizes,
      sizes: stateSizes,
    } = this.state;
    const setSizes = onSetSizes || this._setSizes;
    const sizes = onSetSizes ? propSizes : stateSizes;

    const {
      clientAxis,
      clientSize,
    } = getDirectionProps(direction);

    const deltaPX = getMouseOrTouchPosition(e, clientAxis) - mouseStart;
    const outerSizePX = this.elementRef.current[clientSize];

    const newSizes = computeNewSizesFn({
      startSizes,
      currentSizes: sizes,
      prevPaneNdx,
      gutterSize,
      minSize,
      deltaPX,
      outerSizePX,
    });

    setSizes(newSizes);
  };
  handleMouseDownAndTouchStart = (e) => {
    console.log('split mouse down')
    stopMobileBrowserFromScrolling(e);
    const {
      direction = defaultDirection,
    } = this.props;
    const {
      clientAxis,
    } = getDirectionProps(direction);

    document.addEventListener("mousemove", this.handleMouseAndTouchMove, {passive: false});
    document.addEventListener("mouseup", this.handleMouseUpAndTouchEnd);
    document.addEventListener("touchmove", this.handleMouseAndTouchMove, {passive: false});
    document.addEventListener("touchend", this.handleMouseUpAndTouchEnd);
    const gutterNdx = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);
    const prevPaneNdx = (gutterNdx - 1) / 2;    
    this.setState({
      startSizes: this.state.sizes.slice(),
      mouseStart: getMouseOrTouchPosition(e, clientAxis),
      prevPaneNdx,
      dragging: true,
    });
  };
  recomputeSizes = () => {
    // here it's not entirely clear what to do. Maybe we need options
    // If they user removes a child which sizes do they want? I guess
    // since they removed a child they passed in new sizes so we should
    // pass sizes back? Ugh!
    //
    // Example:
    //
    //   * start: 3 panes, sizes a(33%), b(33%), c(33%)
    //   * user adjusts to sizes a(10%), b(90%), c(10%)
    //   * user deletes pane (a)
    //
    // If we just continue to use the current sizes the we'd get
    //
    //   b(10%), c(90%)
    //
    // We have no way of knowing that b should get the 90%
    //
    // One way would be to pass responsibility for saving the sizes
    // up to the parent. Basically if you want to add/remove children
    // then you need need to keep their state. In that case
    // passing an `onSetSize` prop. It's a function that will be called
    // with an array of sizes.  Update your sizes and pass them in as
    // props
    //
    // But, just so we don't completely fail if the user has not opted
    // into managing the size state then at least do something.
    const {sizes} = this.state;
    const {minSize, direction, gutterSize} = this.props;
    const {
      clientSize,
    } = getDirectionProps(direction);

    const numChildren = React.Children.count(this.props.children);
    const newSizes = numChildren < sizes.length
      // a child was removed, normalizes the sizes
      ? normalizeSizes(sizes.slice(0, numChildren))
      // children were added, make space for them
      : addSpaceForChildren(sizes, numChildren, gutterSize, minSize, this.elementRef.current.parentElement[clientSize]);
    this._setSizes(newSizes);
  }
  componentDidUpdate() {
    const {children, onSetSizes} = this.props;
    const {sizes} = this.state;
    // we need to check if new elements were added.
    if (onSetSizes) {
      return; // not our responsibility
    }

    const numChildren = React.Children.count(children);
    if (sizes.length !== numChildren) {
      setTimeout(this.recomputeSizes);
    }
  }
  render() {
    const {
      children, 
      direction = defaultDirection, 
      gutterSize = defaultGutterSize, 
      sizes: propSizes,
      onSetSizes,
      minSize,
      ...rest
    } = this.props;
    const {
      dragging,
      prevPaneNdx,
      sizes: stateSizes,
    } = this.state;
    const {
      dimension,
      style,
    } = getDirectionProps(direction);

    const sizes = onSetSizes ? propSizes : stateSizes;
    const numPanes = React.Children.count(children);
    const numGutters = numPanes - 1;
    const totalGutterSpace = gutterSize * numGutters;
    const gutterStyle = {[dimension]: `${gutterSize}px`};
    const gutterReservedSizes = distribute(totalGutterSpace, numPanes);

    let childNdx = 0;
    let first = true;
    const newChildren = [];
    React.Children.forEach(children, (child, props) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      if (!first) {
        newChildren.push(
          <Gutter
            key={`gutter${newChildren.length}`}
            direction={direction}
            dragging={dragging}
            current={dragging && childNdx === prevPaneNdx + 1}
            style={gutterStyle}
            onMouseDownAndTouchStart={this.handleMouseDownAndTouchStart}
          />
        );
      }

      const style = {
        [dimension]: `calc(${sizes[childNdx] * 100}% - ${gutterReservedSizes[childNdx]}px)`,
      };

      newChildren.push(
        <div key={`pane${newChildren.length}`} style={style}>
          {React.cloneElement(child)}
        </div>
      );
      first = false;
      ++childNdx;
    });
    return (
      <div
        className="split"
        ref={this.elementRef}
        style={{
          ...this.props.style,
          ...style,
          ...(dragging && {userSelect: 'none'})
        }}
        {...rest}
      >
        {newChildren}
        {dragging ? 
          <style>
            iframe {'{'}
              pointer-events: none !important;
            {'}'}
          </style> : []
        }
      </div>
    );
  }
}

/*
direction
sizes
onSetSizes
compute

*/

