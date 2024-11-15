
require('dotenv').config()
import { initServer } from "./app";

async function init(){
    const app = await initServer()
    app.listen(8000,() => console.log(`Server started at PORT: http://localhost:8000/graphql`))
}

init()