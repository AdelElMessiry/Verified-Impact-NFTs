import { useAuth } from '../../contexts/AuthContext'

// display in case the user makes a request required the user to login
/**
 * display in case the user makes a request required the user to login
 *
 * @type {React.FC<Props>}
 * @returns {React.ReactElement} UI page
 */
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