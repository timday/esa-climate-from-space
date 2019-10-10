import React, {FunctionComponent, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useIntl} from 'react-intl';

import {layersSelector} from '../../reducers/layers';
import {selectedLayersSelector} from '../../reducers/selected-layers';
import fetchLayers from '../../actions/fetch-layers';
import {setSelectedLayerIdAction} from '../../actions/set-selected-layer';
import LayerList from '../layer-list/layer-list';
import Tabs from '../tabs/tabs';
import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent<{}> = () => {
  const intl = useIntl();
  const layers = useSelector(layersSelector);
  const layerIds = useSelector(selectedLayersSelector);
  const dispatch = useDispatch();
  const tabs = [
    {
      id: 'main',
      label: intl.formatMessage({id: 'layerSelector.main'})
    },
    {
      id: 'compare',
      label: intl.formatMessage({id: 'layerSelector.compare'})
    }
  ];

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const isMainTabSelected = activeTabId === tabs[0].id;
  const selectedLayer = isMainTabSelected ? layerIds.main : layerIds.compare;

  const onTabClick = (id: string) => {
    setActiveTabId(id);

    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    if (activeTabId === id) {
      setIsOpen(false);
    }
  };

  const onLayerClick = (id: string) => {
    const newId = selectedLayer === id ? null : id;
    dispatch(setSelectedLayerIdAction(newId, isMainTabSelected));
  };

  useEffect(() => {
    dispatch(fetchLayers());
  }, []);

  return (
    <div className={styles.layerContainer}>
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChanged={id => onTabClick(id)}
      />
      {isOpen && (
        <LayerList
          layers={layers}
          selected={selectedLayer}
          onSelect={id => onLayerClick(id)}
        />
      )}
    </div>
  );
};

export default LayerSelector;
