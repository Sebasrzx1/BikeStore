import LoginRegisterForm from "./components/LoginRegisterForm/LoginRegisterForm.jsx";
import Productos from "./components/Productos.jsx";


function App() {
  return (
    <div className="App">
      <LoginRegisterForm />
      <h1>Panel de administracion - BikeStore</h1>
      <Productos/>
    </div>
    
  );
}

export default App;
