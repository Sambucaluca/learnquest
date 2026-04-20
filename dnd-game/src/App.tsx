import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import MainMenu from './components/MainMenu';
import Settings from './components/Settings';
import WorldSelect from './components/WorldSelect';
import CharacterCreation from './components/CharacterCreation';
import GameMap from './components/GameMap';
import Inventory from './components/Inventory';
import CharacterSheet from './components/CharacterSheet';
import Combat from './components/Combat';
import Dialogue from './components/Dialogue';
import Shop from './components/Shop';
import MapOverview from './components/MapOverview';
import GameOver from './components/GameOver';

export default function App() {
  const { screen, setScreen } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (screen === 'inventory' || screen === 'character_sheet' || screen === 'map_overview') {
          setScreen('game');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, setScreen]);

  switch (screen) {
    case 'menu':
      return <MainMenu />;
    case 'settings':
      return <Settings />;
    case 'world_select':
      return <WorldSelect />;
    case 'character_create':
      return <CharacterCreation />;
    case 'game':
      return <GameMap />;
    case 'inventory':
      return <Inventory />;
    case 'character_sheet':
      return <CharacterSheet />;
    case 'combat':
      return <Combat />;
    case 'dialogue':
      return <Dialogue />;
    case 'shop':
      return <Shop />;
    case 'map_overview':
      return <MapOverview />;
    case 'game_over':
      return <GameOver />;
    case 'rest':
      return <GameMap />;
    default:
      return <MainMenu />;
  }
}
