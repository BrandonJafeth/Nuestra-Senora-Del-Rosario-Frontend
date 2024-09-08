
import { enqueueSnackbar } from 'notistack'
import './App.css'

function App() {
 

  return (
    <>
    <button onClick={() => enqueueSnackbar('That was easy!')}>Show snackbar</button>
    </>
  )
}

export default App


