import server from "./server";
import Keeper from "./Keeper";

function Wallet({
  user,
  setUser,
  balance,
  setBalance,
  sendAmount,
  setSendAmount,
}) {
  async function onSelectUser(e) {
    const selectedUser = e.target.value;
    setUser(selectedUser);

    if (selectedUser) {
      const address = Keeper.getAddress(selectedUser);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  const setValue = (setter) => (e) => setter(e.target.value);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Sender wallet:{" "}
        {Keeper.getAddress(user) ? `${Keeper.getAddress(user)}` : null}
        <select className="selector" onChange={onSelectUser} value={user}>
          <option value="">- Select a wallet -</option>
          {Keeper.Accounts.map((u, i) => (
            <option key={i} value={u}>
              {u}
            </option>
          ))}
        </select>
      </label>
      <div className="balance">Sender balance: {balance}</div>

      <label>
        Amount to send
        <input
          placeholder="How much would you like to send?"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
    </div>
  );
}

export default Wallet;
