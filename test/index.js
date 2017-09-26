const fs = require('fs')
const tape = require('tape')
const spawn = require('tape-spawn')
const Web3 = require('web3')

// these can be generated by running the compile function
var runnerCode = "0x6060604052341561000f57600080fd5b5b6118df8061001f6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063194e10ce1461003e575b600080fd5b341561004957600080fd5b6100a2600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610155565b6040518084600460200280838360005b838110156100ce5780820151818401525b6020810190506100b2565b5050505090500180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156101185780820151818401525b6020810190506100fc565b50505050905090810190601f1680156101455780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b61015d6117b8565b6101656117e0565b600061016f6117f4565b610177611825565b6000610182886102d2565b9250600090505b866001820110156101ad5761019f8382846102fd565b5b8080600101915050610189565b600182600001901515908115158152505060008714156101cc576101f9565b6108008710156101e6576101e18388846102fd565b6101f8565b6101ef83610457565b82602001819052505b5b8260000151600060048110151561020c57fe5b602002015186600060048110151561022057fe5b6020020181815250508260000151600160048110151561023c57fe5b602002015186600160048110151561025057fe5b6020020181815250508260000151600260048110151561026c57fe5b602002015186600260048110151561028057fe5b6020020181815250508260000151600360048110151561029c57fe5b60200201518660036004811015156102b057fe5b60200201818152505081602001519450816040015193505b5050509250925092565b6102da6117f4565b6102e682836080610493565b81600001819052506102f781610703565b5b919050565b60008060008060006108008710151561031557600080fd5b6104008710156103495761032f88888a6000015189610731565b61033c88600001516107ef565b886000018190525061044c565b6104007c01000000000000000000000000000000000000000000000000000000008960000151600260048110151561037d57fe5b602002015181151561038b57fe5b0481151561039557fe5b069450848660400181815250506103ad8886886108af565b9350935093509350610443608060405190810160405280868b6000015160006004811015156103d857fe5b6020020151188152602001858b6000015160016004811015156103f757fe5b6020020151188152602001848b60000151600260048110151561041657fe5b6020020151188152602001838b60000151600360048110151561043557fe5b6020020151188152506107ef565b88600001819052505b5b5050505050505050565b61045f6117e0565b6104676117e0565b6104748360000151610918565b905061048a61048582836020610493565b610918565b91505b50919050565b61049b6117b8565b6104a36117e0565b600060048551016040518059106104b75750595b908082528060200260200182016040525b509150600090505b845181101561057e5784818151811015156104e757fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f010000000000000000000000000000000000000000000000000000000000000002828281518110151561054057fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053505b80806001019150506104d0565b600090505b8360208202101561062957600181017f0100000000000000000000000000000000000000000000000000000000000000028260018451038151811015156105c657fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535061060086836109bc565b60019004838260048110151561061257fe5b6020020181815250505b8080600101915050610583565b61064583600060048110151561063b57fe5b6020020151610d45565b83600060048110151561065457fe5b60200201818152505061067983600160048110151561066f57fe5b6020020151610d45565b83600160048110151561068857fe5b6020020181815250506106ad8360026004811015156106a357fe5b6020020151610d45565b8360026004811015156106bc57fe5b6020020181815250506106e18360036004811015156106d757fe5b6020020151610d45565b8360036004811015156106f057fe5b6020020181815250505b50509392505050565b6110006040518059106107135750595b908082528060200260200182016040525b5081604001819052505b50565b600061073b61184f565b6000806000806104008910151561075157600080fd5b8860040295508960400151945087600060048110151561076d57fe5b602002015188600160048110151561078157fe5b602002015189600260048110151561079557fe5b60200201518a60036004811015156107a957fe5b6020020151935093509350935060208601955083868601526020860195508286860152602086019550818686015260208601955080868601525b50505050505050505050565b6107f76117b8565b60008060008085600060048110151561080c57fe5b602002015186600160048110151561082057fe5b602002015187600260048110151561083457fe5b602002015188600360048110151561084857fe5b60200201519350935093509350610863828518828518610ef6565b8094508195505050610879828518828518610ef6565b80925081935050506080604051908101604052808581526020018481526020018381526020018281525094505b50505050919050565b60008060008060006108bf61184f565b610400881015156108cf57600080fd5b876004029150886040015190506020820191508181015195506020820191508181015194506020820191508181015193506020820191508181015192505b505093509350935093565b6109206117e0565b600060806040518059106109315750595b908082528060200260200182016040525b50915082600060048110151561095457fe5b6020020151905080602083015282600160048110151561097057fe5b6020020151905080604083015282600260048110151561098c57fe5b602002015190508060608301528260036004811015156109a857fe5b602002015190508060808301525b50919050565b600080600080600080604088511115610a63576002886000604051602001526040518082805190602001908083835b602083101515610a1157805182525b6020820191506020810190506020830392506109eb565b6001836020036101000a03801982511681845116808217855250505050505090500191505060206040518083038160008661646e5a03f11515610a5357600080fd5b5050604051805190509450610bd0565b600092505b875183108015610a785750602083105b15610b195782601f0360080260020a8884815181101515610a9557fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900402600102851794505b8280600101935050610a68565b602092505b875183108015610b2e5750604083105b15610bcf5782603f0360080260020a8884815181101515610b4b57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900402600102841793505b8280600101935050610b1e565b5b7f363636363636363636363636363636363636363636363636363636363636363660010291507f5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c6001029050600285821885831860028886188887188c600060405160200152604051808460001916600019168152602001836000191660001916815260200182805190602001908083835b602083101515610c8857805182525b602082019150602081019050602083039250610c62565b6001836020036101000a038019825116818451168082178552505050505050905001935050505060206040518083038160008661646e5a03f11515610ccc57600080fd5b50506040518051905060006040516020015260405180846000191660001916815260200183600019166000191681526020018260001916600019168152602001935050505060206040518083038160008661646e5a03f11515610d2e57600080fd5b50506040518051905095505b505050505092915050565b60006001610d5e600184811515610d5857fe5b04610fb9565b02640100000000610d7e64010000000085811515610d7857fe5b04610fb9565b0268010000000000000000610da66801000000000000000086811515610da057fe5b04610fb9565b026c01000000000000000000000000610dd66c0100000000000000000000000087811515610dd057fe5b04610fb9565b02700100000000000000000000000000000000610e0e70010000000000000000000000000000000088811515610e0857fe5b04610fb9565b0274010000000000000000000000000000000000000000610e4e7401000000000000000000000000000000000000000089811515610e4857fe5b04610fb9565b027801000000000000000000000000000000000000000000000000610e9678010000000000000000000000000000000000000000000000008a811515610e9057fe5b04610fb9565b027c0100000000000000000000000000000000000000000000000000000000610ee67c01000000000000000000000000000000000000000000000000000000008b811515610ee057fe5b04610fb9565b020101010101010190505b919050565b6000806000806000869250859150600090505b6008811015610f4257610f1c8383611002565b8093508194505050610f2e83836113c3565b80935081945050505b600281019050610f09565b600090505b6008811015610fae57610f74610f5d84836116ca565b610f6789846116ca565b0163ffffffff16826116ed565b85179450610f9c610f8583836116ca565b610f8f88846116ca565b0163ffffffff16826116ed565b841793505b8080600101915050610f47565b5b5050509250929050565b6000630100000063ff0000008316811515610fd057fe5b0461010062ff00008416811515610fe357fe5b0461010061ff00851602630100000060ff86160201010190505b919050565b6000806000806000806110977c01000000000000000000000000000000000000000000000000000000008981151561103657fe5b046c010000000000000000000000008a81151561104f57fe5b047c01000000000000000000000000000000000000000000000000000000008a81151561107857fe5b046c010000000000000000000000008b81151561109157fe5b04611707565b93509350935093506c010000000000000000000000008363ffffffff16027c01000000000000000000000000000000000000000000000000000000008563ffffffff16021795506c010000000000000000000000008163ffffffff16027c01000000000000000000000000000000000000000000000000000000008363ffffffff1602179450611199680100000000000000008981151561113457fe5b0478010000000000000000000000000000000000000000000000008981151561115957fe5b04680100000000000000008a81151561116e57fe5b0478010000000000000000000000000000000000000000000000008c81151561119357fe5b04611707565b8094508195508296508397505050505078010000000000000000000000000000000000000000000000008163ffffffff1602680100000000000000008563ffffffff16021786179550680100000000000000008263ffffffff160278010000000000000000000000000000000000000000000000008463ffffffff16021785179450611287740100000000000000000000000000000000000000008881151561123e57fe5b046401000000008981151561124f57fe5b04740100000000000000000000000000000000000000008b81151561127057fe5b046401000000008c81151561128157fe5b04611707565b809450819550829650839750505050506401000000008163ffffffff1602740100000000000000000000000000000000000000008363ffffffff160217861795506401000000008363ffffffff1602740100000000000000000000000000000000000000008563ffffffff1602178517945061135560018881151561130857fe5b047001000000000000000000000000000000008a81151561132557fe5b0460018b81151561133257fe5b047001000000000000000000000000000000008b81151561134f57fe5b04611707565b8094508195508296508397505050505060018263ffffffff16027001000000000000000000000000000000008463ffffffff160217861795507001000000000000000000000000000000008163ffffffff160260018563ffffffff160217851794505b505050509250929050565b6000806000806000806114607c0100000000000000000000000000000000000000000000000000000000898115156113f757fe5b0478010000000000000000000000000000000000000000000000008a81151561141c57fe5b04740100000000000000000000000000000000000000008b81151561143d57fe5b047001000000000000000000000000000000008c81151561145a57fe5b04611707565b93509350935093508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff1602170217021795506114f268010000000000000000898115156114b557fe5b046401000000008a8115156114c657fe5b0460018b8115156114d357fe5b046c010000000000000000000000008c8115156114ec57fe5b04611707565b809750819450829550839650505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff166401000000008d021702170217021795506115d5740100000000000000000000000000000000000000008881151561156457fe5b047001000000000000000000000000000000008981151561158157fe5b047c01000000000000000000000000000000000000000000000000000000008a8115156115aa57fe5b0478010000000000000000000000000000000000000000000000008b8115156115cf57fe5b04611707565b809650819750829450839550505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff16021702170217945061166f60018881151561162a57fe5b046c010000000000000000000000008981151561164357fe5b04680100000000000000008a81151561165857fe5b046401000000008b81151561166957fe5b04611707565b809550819650829750839450505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff166401000000008c021702170217021794505b505050509250929050565b60006020808302610100030360020a838115156116e357fe5b0490505b92915050565b60006020808302610100030360020a830290505b92915050565b6000806000806000858901905063020000008163ffffffff1681151561172957fe5b046080820217881897508888019050628000008163ffffffff1681151561174c57fe5b04610200820217871896508787019050620800008163ffffffff1681151561177057fe5b046120008202178618955086860190506140008163ffffffff1681151561179357fe5b0462040000820217891898508888888894509450945094505b50945094509450949050565b6080604051908101604052806004905b60008152602001906001900390816117c85790505090565b602060405190810160405280600081525090565b60c060405190810160405280611808611863565b81526020016000801916815260200161181f61188b565b81525090565b60606040519081016040528060001515815260200161184261189f565b8152602001600081525090565b602060405190810160405280600081525090565b6080604051908101604052806004905b60008152602001906001900390816118735790505090565b602060405190810160405280600081525090565b6020604051908101604052806000815250905600a165627a7a7230582035568bdc41631979589b184bdb1c2c060fe376afd584f56a0ef13cfa6593d1650029"
var runnerABI = [{"constant":true,"inputs":[{"name":"input","type":"bytes"},{"name":"upToStep","type":"uint256"}],"name":"run","outputs":[{"name":"vars","type":"uint256[4]"},{"name":"proof","type":"bytes"},{"name":"readIndex","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"}]

function compile() {
    const solc = require('solc')
    function readFile(name) {
        return fs.readFileSync(name, {encoding: 'utf-8'})
    }

    const compilerInput = {
        'language': 'Solidity',
        'sources': {
        'scryptFramework.sol': {'content': readFile('contracts/scryptFramework.sol')},
        'scryptRunner.sol': {'content': readFile('contracts/scryptRunner.sol')}
        }
    }
    var results = JSON.parse(solc.compileStandard(JSON.stringify(compilerInput)))
    runnerCode = '0x' + results['contracts']['scryptRunner.sol']['ScryptRunner']['evm']['bytecode']['object']
    runnerABI = results['contracts']['scryptRunner.sol']['ScryptRunner']['abi']
    console.log('var runnerCode = "' + runnerCode + '"')
    console.log('var runnerABI = ' + JSON.stringify(runnerABI) + '')
}
compile()

/*
Modify geth by setting the "call" timeout to 500 seconds instead of 5

start geth using

geth --dev --rpc

then use `geth attach ipc:///tmp/ethereum_dev_mode/geth.ipc` with
var account = personal.newAccount('')
account
// and copy the account to below
personal.unlockAccount(account)
miner.setEtherbase(account)
miner.start()
*/
// Needs to be done every time: personal.unlockAccount(account)

var account = '0xcf2c80cc7ad6dfc8238e9d154b533bd624feb384'
// Remove if not deployed yet
var contractAddr = 0//'0xfa7bE2e5aEA20CEE4384b109a91f26EdF5338a68'
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

var expectations = {
    0: [
        "0x3c268302673baaf8870141b9f4794454d2205c8f4074876a845d4df804bf55f",
        "0x62f06b94b13667ab93881eaeee5bdf4e803b452cc81928c314fe8160e1ecbb4f",
        "0xd97d406e33f717cad5950a7e6bdb7efbd171aa0dd30a1e448c33f791cf8c2016",
        "0x8e5bfa6d8e22bf3f240a4fc063e1f5b100728f046756d669cee62bb872154b45"
    ],
    1: [
        "0xafd217fb5feb256ef297b38bfaa3b6ab11bc21149568a18bf91dac87db4e7a83",
        "0x6458f3f41a9147b9abb7535fccca15de735fbc7b1bfeacfd3597600e12c08012",
        "0xc5a9f7db6589b26e8ab04ddd707892ceff0cf3e1ed5432b837540d6d1946952e",
        "0x396ffd44dfb9444c8adb64caffd9dd922d6542dae17db75ed82bf38bf3b91b78"
    ],
    1024: [
        "0x1c62770d44a4eeb47f01de7e65c8f43b026c637cf208dd6013a3f9df6e6ded0a",
        "0xe7b7ae5b8deaa9d9a147775886b0d31cfc7af04a27662405de9554aa06b1800b",
        "0x28c68c4b78f4b4fad370f4b662d9e7bc01fcecf2b6d9545714b909f272fe49b5",
        "0xc19f7ed077ec236a0721b6fe7abc9369ade9d7d7b60d22bbbe0baf8699c09472"
    ],
    1025: [
        "0xfaf12052158160f6a7255bc1689a6cc5bd8bc953ebddf8bbe645157d479119b9",
        "0xf5d793693d8f7c2840341db0abb693c2e562bae33883c731b1d9170436b2a5c1",
        "0xf92d1f40b7a4f75f121568fe96389755f8b689a05082e084cc8e6b70eb0ec1d3",
        "0x799d0314cfc8962dab57508b04f6d94e73b554c3d1a6bd0bb7c404fcc08b1133"
    ],
    2048: [
        "0x3f3d915849eba08428ac85aa72f9159d4a406afc43a598789d32110ff4d0bc40",
        "0x3959831424f3546318d09292760cc19bd6a7559f4bd603470c16c61b45398fa",
        "0x9e17c9061d1313a0a0998c7664d5588f13c9040cb4aa942702ff75c460e92145",
        "0x28b3b2ce855bea481cd966c078c062a715e2897e7c144e15c05dfd52e3bb7cdb"
    ]
}

async function deployIfNeeded() {
    var block = await web3.eth.getBlockNumber()
    console.log("At block " + block)
    var runner
    if (contractAddr) {
        runner = new web3.eth.Contract(runnerABI, contractAddr)
    } else {
        runner = await new web3.eth.Contract(runnerABI).deploy({data: runnerCode}).send({
            from: account,
            gas: 4000000
        })
    }
    console.log("Contract deployed at " + runner.options.address)
    return runner
}

async function test() {
    var runner = await deployIfNeeded()
    var error = false
    var input = '0x5858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858'
    for (var i of [0, 1, 1024, 1025, 1111, 2048]) {
        var result = await runner.methods.run(input, i).call({
            from: account
        })
        for (var j = 0; j < 4; j++) {
            if (expectations[i][j] != web3.utils.numberToHex(result.vars[j])) {
                console.log("Invalid internal state at step " + i)
                console.log(web3.utils.numberToHex(result.vars[0]))
                console.log(web3.utils.numberToHex(result.vars[1]))
                console.log(web3.utils.numberToHex(result.vars[2]))
                console.log(web3.utils.numberToHex(result.vars[3]))
                error = true
            }
        }
    }
    result = await runner.methods.run(input, 2049).call({from: account})
    if (result.proof != "0xda26bdbab79be8f5162c4ca87cc52d6f926fb21461b9fb1c88bf19180cb5c246000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000") {
        console.log("Invalid result after step 2049: " + result.proof)
        error = true
    }
    if (!error) {
        console.log("success")
    }
}

async function tryStuff() {
    var runner = await deployIfNeeded()
    var error = false
    var input = '0x5858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858'
    console.log(await runner.methods.run(input, 1).call({from: account}))
}

//test()
tryStuff();