import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import Globes from '../../main/globes/globes';
import {useStoryParams} from '../../../hooks/use-story-params';
import StoryContent from '../story-content/story-content';
import StoryMedia from '../story-media/story-media';
import StoryFooter from '../story-footer/story-footer';
import fetchStory from '../../../actions/fetch-story';
import Header from '../header/header';
import StoryVideo from '../story-video/story-video';
import setGlobeProjectionAction from '../../../actions/set-globe-projection';
import setSelectedLayerIdsAction from '../../../actions/set-selected-layer-id';
import setGlobeTimeAction from '../../../actions/set-globe-time';
import Share from '../../main/share/share';
import SplashScreen from '../splash-screen/splash-screen';
import LayerDescription from '../layer-description/layer-description';

import {StoryMode} from '../../../types/story-mode';
import {Slide, Story as StoryType} from '../../../types/story';
import {GlobeProjection} from '../../../types/globe-projection';
import {SlideType} from '../../../types/slide-type';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();
  const sphereProjection = GlobeProjection.Sphere;
  const dispatch = useDispatch();
  const {
    mode,
    slideIndex,
    currentStoryId,
    selectedStory,
    storyListItem
  } = storyParams;
  const storyMode = mode === StoryMode.Stories;

  // fetch story of active storyId
  useEffect(() => {
    currentStoryId && dispatch(fetchStory(currentStoryId));
  }, [dispatch, currentStoryId]);

  // set globe to sphere projection
  useEffect(() => {
    dispatch(setGlobeProjectionAction(sphereProjection, 0));
  }, [dispatch, sphereProjection]);

  // clean up story on unmount
  useEffect(
    () => () => {
      dispatch(setSelectedLayerIdsAction(null, true));
      dispatch(setSelectedLayerIdsAction(null, false));
      dispatch(setGlobeTimeAction(0));
    },
    [dispatch]
  );

  if (!mode) {
    return null;
  }

  const getRightSideComponent = (slide: Slide, story: StoryType) => {
    if (slide.type === SlideType.Image && slide.images) {
      return (
        <StoryMedia
          images={slide.images}
          imageCaptions={slide.imageCaptions}
          storyId={story.id}
        />
      );
    } else if (slide.type === SlideType.Video && slide.videoId) {
      return <StoryVideo videoId={slide.videoId} />;
    }

    return (
      <div className={styles.globeContainer}>
        <Globes backgroundColor={'#000000'} />
        {slide.layerDescription && (
          <LayerDescription layerDescription={slide.layerDescription} />
        )}
      </div>
    );
  };

  return (
    <div className={styles.story}>
      {storyListItem && (
        <Header
          backLink={`/${mode.toString()}`}
          backButtonId="backToStories"
          title={storyListItem.title}>
          {storyMode && <Share />}
        </Header>
      )}
      <main className={styles.main}>
        {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
        {selectedStory?.slides.map(
          (currentSlide, index) =>
            index === slideIndex &&
            (currentSlide.type === SlideType.Splashscreen ? (
              <SplashScreen
                key={index}
                storyId={selectedStory.id}
                slide={currentSlide}
              />
            ) : (
              <React.Fragment key={index}>
                <StoryContent
                  mode={mode}
                  storyId={selectedStory.id}
                  slide={currentSlide}
                />
                {getRightSideComponent(currentSlide, selectedStory)}
              </React.Fragment>
            ))
        )}
      </main>
      <StoryFooter
        mode={mode}
        slideIndex={slideIndex}
        selectedStory={selectedStory}
      />
    </div>
  );
};

export default Story;