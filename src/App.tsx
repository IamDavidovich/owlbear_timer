import './App.css'
import CountdownUi from "./CountdownUi";
import OBR from "@owlbear-rodeo/sdk";
import {useEffect, useState} from "react";

function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(
      () =>
          OBR.onReady(() => {
            // interact with the SDK
            setSceneReady(true);
          }),
      []
  );

  if (sceneReady) {
    return <CountdownUi />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
        <div>Loadin...</div>
    );
  }
}

export default App
