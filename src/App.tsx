import './App.css'
import Countdown from "./Countdown";
import OBR from "@owlbear-rodeo/sdk";
import {useEffect, useState} from "react";

function App() {
    const [sceneReady, setSceneReady] = useState(false);
    useEffect(
        () =>
            OBR.onReady(() => {
                setSceneReady(true);
            }),
        []
    );

    if (sceneReady) {
        return <Countdown />;
    } else {
        return <div>Loadin'...</div>;
    }
}

export default App
