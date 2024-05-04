<div className="bg-white">
<div className="flex h-screen flex-col items-center justify-center">
  <div className="max-h-auto mx-auto max-w-xl">
    <div className="mb-8 space-y-3">
      <p className="text-xl font-semibold">AlphaDropDetails</p>
      <p className="text-gray-500">
        AlphaDrop Details. <br />
        Dont airdrop tokens that user dump instantly
      </p>
    </div>

    {/* Number of Positions */}
    <div className="mb-4">
      <label
        htmlFor="positions"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Number of Positions:
      </label>
      <input
        type="text"
        id="positions"
        value={positions}
        onChange={(e) => setPositions(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>

    {/* Vesting Period */}
    <div className="mb-4">
      <label
        htmlFor="vestingPeriod"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Vesting Period (months):
      </label>
      <input
        type="text"
        id="vestingPeriod"
        value={vestingPeriod}
        onChange={(e) => setVestingPeriod(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>

    {/* Protocol Address (Dropdown) */}
    <div className="mb-4">
      <label
        htmlFor="protocolAddress"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Protocol Address:
      </label>
      <select
        id="protocolAddress"
        value="0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C"
        onChange={(e) => setProtocolAddress(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      >
        <option value="" disabled>
          Select a protocol address
        </option>
        <option value="0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C">
          LendingFi (Deposit Position)
        </option>
        <option value="0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C">
          Sunswap (Liquidity Position)
        </option>
      </select>
    </div>

    {/* Token Address */}
    <div className="mb-4">
      <label
        htmlFor="tokenAddress"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Token Address:
      </label>
      <input
        type="text"
        id="tokenAddress"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>

    {/* Amount per Position */}
    <div className="mb-4">
      <label
        htmlFor="amountPerPosition"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Amount per Position:
      </label>
      <input
        type="text"
        id="amountPerPosition"
        value={amountPerPosition}
        onChange={(e) => setAmountPerPosition(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>

   

    {/* Submit Button */}
    <button
      onClick={createDeposits}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Submit fff
    </button>

    <button onClick={() => generateRandomStrings(6, 6)}>
      click me
    </button>

    {links.map((link, index) => (
      <p className=" text-gray-800" key={index}>
        {link}
      </p>
    ))}
  </div>
</div>
</div>