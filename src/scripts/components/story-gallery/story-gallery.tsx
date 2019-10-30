import React, {FunctionComponent, useState, useEffect} from 'react';
import cx from 'classnames';

import {PreviousIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';

import styles from './story-gallery.styl';

interface Props {
  images: string[];
}

const StoryGallery: FunctionComponent<Props> = ({images}) => {
  const imagesLength = images.length;
  const containerWidth = imagesLength * 100;
  const imageWidth = 100 / imagesLength;
  const [currentIndex, setCurrentIndex] = useState(0);
  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex < imagesLength - 1;

  const onPrevClick = () => {
    if (currentIndex <= 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  const onNextClick = () => {
    if (currentIndex >= imagesLength - 1) {
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const classes = cx([styles.slider, images.length > 1 && styles.transition]);

  return (
    <div className={styles.storyGallery}>
      <div className={styles.buttonContainer}>
        <div onClick={onPrevClick}>
          {showPrevButton ? <PreviousIcon /> : null}
        </div>
        <div onClick={onNextClick}>{showNextButton ? <NextIcon /> : null}</div>
      </div>
      <div
        className={classes}
        style={{
          width: `${containerWidth}%`,
          transform: `translateX(-${imageWidth * currentIndex}%)`
        }}>
        {images.map((image, index) => (
          <img
            className={styles.sliderImage}
            src={image}
            key={index}
            style={{width: `${imageWidth}%`}}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryGallery;
