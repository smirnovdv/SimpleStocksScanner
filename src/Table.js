import React, { Component } from 'react'



export default class Table extends Component {
	constructor(props){
		super(props)
		this.state = {
			scanData:[]
		}
	}

	
	fetch_scan = () => {
		fetch('https://scanner-server.herokuapp.com/get_scan')
		.then(
			(response) => {
				if (response.status !== 200) {
					console.log('API fetch error. Status code: ' + response.status);
					return
				}
				response.text().then((data) => {
					this.setState((prevState, props) => {
						let coloredData = JSON.parse(data).map((item,index)=>{
							let coloredItem = Object.assign(item,{color:""})
							if (prevState.scanData[index] && prevState.scanData.find(x => x.ticker === item.ticker)) {
								if ((prevState.scanData.find((x => x.ticker === item.ticker)).last || Infinity) > item.last) { 
									coloredItem = Object.assign(item,{color:"bg-danger"})}
								else if ((prevState.scanData.find(x => x.ticker === item.ticker).last || 0) < item.last) {
									coloredItem = Object.assign(item,{color:"bg-success"})
								}
							}
							return coloredItem
						})
						
						return {scanData: coloredData}
					}
					);
					console.log(this.state.scanData)
				})
			}
		)
	}
	componentDidMount() {
		this.fetch_scan()
		this.interval = setInterval(() => this.fetch_scan(),10000);
  }
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	
	render() {
		let table = this.state.scanData.map((row) => {
			return (
				row ?
			<tr class={row.color}>
	      <th>{row.ticker}</th>
				<td>{row.pricechange + '%'}</td>
				<td>{row.last}</td>
				<td>{row.vwap}</td>
				<td>{row.volume/10 + 'K'}</td>
				<td>{(row.volume*100/row.tradecount).toFixed(0) || "-"}</td>
				<td>{row.shortableshares || "-"}</td>
			</tr>
			: ""
			)
		})
		return (
			<div className="table-responsive" style={{margin:"0px auto", width:"fit-content"}}>
					
				<table className="table table-bordered table-dark">
					<thead>
						<tr style={{width:"fit-content"}}>
							<th >Ticker</th>
							<th >Daily Change</th>
							<th >Last Price</th>
							<th >VWAP</th>
							<th >Volume</th>
							<th >Av. Trade</th>
							<th >Shortatable</th>
						</tr>
					</thead>
					{table}
				</table>
		</div>
		)
	}
}
