import React, { useEffect, useState } from 'react';
import { StaticMap, MapContext } from 'react-map-gl';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import { PathLayer } from '@deck.gl/layers';
import data from './data/source'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY || null

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30
};

const App = () => {
  const [view, setView] = useState(INITIAL_VIEW_STATE)
  const [layer, setLayer] = useState([])
  const [progress, setProgress] = useState(100)
  const [disable, setDisable] = useState(false)

  const playPath = () => {
    setDisable(true)
    for (let i = 0; i <= 100; i++) {
      setTimeout(() => {
        setProgress(i)
        i == 100 && setDisable(false)
      }, i * 100)
    }
  }

  const createLayer = () => {
    const { geometry: { coordinates } } = data
    const filteredData = coordinates.slice(0, Math.round(coordinates.length * progress / 100))
    const l = new PathLayer({
      id: 'path-layer',
      data: [{
        path: filteredData,
        color: [144, 224, 239]
      }],
      pickable: true,
      widthScale: 5,
      getPath: d => d.path,
      getColor: d => d.color,
    });
    filteredData.length && setView({
      ...view,
      latitude: filteredData[filteredData.length - 1][1],
      longitude: filteredData[filteredData.length - 1][0],
    })
    setLayer(l)
  }

  useEffect(() => {
    createLayer()
  }, [progress])

  useEffect(() => {
    const { geometry: { coordinates } } = data
    createLayer()
    setView({
      ...view,
      latitude: coordinates[0][1],
      longitude: coordinates[0][0],
      zoom: 15,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator()
    })
  }, [])

  return (
    <Box>

      <DeckGL
        initialViewState={view}
        onViewStateChange={({ viewState }) => setView(viewState)}
        controller={true}
        layers={[layer]}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          mapStyle={
            TOKEN ?
              'mapbox://styles/mapbox/satellite-streets-v11' :
              'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
          }
          mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        />
        {/* <NavigationControl style={NAV_CONTROL_STYLE} visualizePitch={true} showCompass={true} /> */}
        <Box sx={{ margin: 2 }}>
          <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
          >

            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() => setView({
                ...view,
                zoom: view.zoom + 1,
                transitionDuration: 0,
              })}
            >
              <AddRoundedIcon sx={{ color: 'black' }} />
            </Button>
            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() =>
                setView({
                  ...view,
                  zoom: view.zoom - 1,
                  transitionDuration: 0,
                })
              }
            >
              <RemoveRoundedIcon sx={{ color: 'black' }} />
            </Button>
            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() =>
                setView({
                  ...view,
                  pitch: view.pitch + 10,
                  transitionDuration: 0,
                })
              }
            >
              <ArrowDropUpIcon sx={{ color: 'black' }} />
            </Button>
            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() =>
                setView({
                  ...view,
                  pitch: view.pitch - 10,
                  transitionDuration: 0,
                })
              }
            >
              <ArrowDropDownIcon sx={{ color: 'black' }} />
            </Button>
            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() =>
                setView({
                  ...view,
                  bearing: view.bearing + 10,
                  transitionDuration: 0,
                })
              }
            >
              <RotateRightIcon sx={{ color: 'black' }} />
            </Button>
            <Button
              variant="contained"
              color='inherit'
              sx={{
                backgroundColor: 'white'
              }}
              onClick={() => setView({
                ...view,
                bearing: view.bearing - 10,
                transitionDuration: 0,
              })
              }
            >
              <RotateLeftIcon sx={{ color: 'black' }} />
            </Button>
          </ButtonGroup>
        </Box>
      </DeckGL >
      <Card sx={{ position: 'absolute', bottom: 0, right: 0, left: 0, margin: 2, marginBottom: 6 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Progress:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              variant="text"
              color='inherit'
              sx={{
                backgroundColor: 'white',
                marginTop: 1
              }}
              onClick={playPath}
            >
              <PlayCircleOutlineIcon sx={{ color: 'black' }} />
            </Button>
            <Slider
              sx={{ width: '90%', marginRight: 2, marginLeft: 4 }}
              aria-label="path"
              value={progress}
              onChange={({ target: { value } }) => setProgress(value)}
              valueLabelDisplay="auto"
              min={0}
              step={1}
              max={100}
              disabled={disable}
              marks={[{
                value: 0,
                label: '0%'
              },
              {
                value: 50,
                label: '50%'
              },
              {
                value: 100,
                label: '100%'
              }
              ]}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App
