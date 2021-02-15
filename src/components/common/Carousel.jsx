import React from "react";
import Slider from "react-slick"

import Button from "@material-ui/core/Button"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const DEFAULT_SLIDES_TO_SHOW = 3;
const MAX_MOBILE_VIEWPORT_WIDTH = 992;
const isClient = typeof window !== 'undefined';


const PrevArrow = props => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      onClick={onClick}
    >
      <i className="fas fa-angle-left"></i>
    </button>
  );
}

const NextArrow = props => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      onClick={onClick}
    >
      <i className="fas fa-angle-right"></i>
    </button>
  );
}

class EditableCarousel extends React.Component {
  state = {
    viewportWidth: 0,
  };

  componentDidMount() {
    if (isClient) {
      window.addEventListener('resize', this.updateWindowDimensions);
      setTimeout(() => {
        this.updateWindowDimensions();
      }, 250);
    }
  }

  componentWillUnmount() {
    if (isClient) window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ viewportWidth: window.innerWidth });
  }

  onSaveItem = itemId => item => {
    const newCollection = {
      ...this.props.collection,
      [itemId]: item
    }

    this.props.onSave(newCollection)
  }

  onDeleteItem = itemId => () => {
    this.props.onDeleteItem(itemId)
  }

  onAddItem = () => {
    this.props.onAddItem(this.props.defaultContent)
  }


  render() {
    const { viewportWidth } = this.state;
    const isMobile = Boolean(viewportWidth <= MAX_MOBILE_VIEWPORT_WIDTH)
    const { collection, SlideComponent, isEditingPage, options } = this.props;
    const collectionLength = Object.keys(collection).length;

    let slidesToShow = isMobile ? 1 : options.slidesToShow || DEFAULT_SLIDES_TO_SHOW;
    if (collectionLength < slidesToShow) {
      slidesToShow = collectionLength
    }


    const settings = {
      infinite: options.infinite || true,
      speed: options.speed || 500,
      slidesToShow: slidesToShow,
      slidesToScroll: options.slidesToScroll || 1,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      draggable: !isEditingPage,
      swipe: !isEditingPage,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        },
      ]
    };

    const collectionKeys = Object.keys(collection);

    if (!isEditingPage && (collectionLength < 1)) {
      return <p>Coming soon!</p>
    }

    return (
      <>
        <Slider { ...settings }>
          {collectionKeys.map(key => {
            const content = collection[key];
            return(
              <SlideComponent
                key={`slide-${key}`}
                content={content}
                onSave={this.onSaveItem(key)}
                onDelete={this.onDeleteItem(key)}
                classes={this.props.slideClasses}
              />
            )
          })}
        </Slider>
        {
          isEditingPage &&
          <div className="row mt-4">
            <div className="col-12">
              <Button onClick={this.onAddItem} color="default" variant="contained">Add item</Button>
            </div>
          </div>
        }
      </>
    );
  }
}


EditableCarousel.defaultProps = {
  collection: {},
  isEditingPage: false,
  options: {}
}

export default EditableCarousel;


