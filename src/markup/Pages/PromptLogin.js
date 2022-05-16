import { useAuth } from '../../contexts/AuthContext'

//returned when the page that user requested require login with casper and user not signin 
const PromptLogin = () => {
  const { login } = useAuth();
  return (
    <div className='p-3 mt-5' style={{height:"100vh"}}>
      <h4 align='center' variant='h4'>
        Please connect to signer
        <br/><br/>
        <button onClick={login} className="btn btn-success">
          Connect
        </button>
      </h4>

    </div>
  )
}

export default PromptLogin