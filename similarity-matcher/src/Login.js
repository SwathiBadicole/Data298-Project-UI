import { useRef, useState, useEffect } from "react";
import Button from '@mui/material/Button';
//import Tabs from './Component/Tabs';
// import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import PublishIcon from '@mui/icons-material/Publish';
import logo from './logo.svg';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';



const getTopFive = (dataObj) => {
	const topFiveDataItems = [];
	for (let shape in dataObj) {
		topFiveDataItems.push({ id: shape, waferShape: shape, defect: dataObj[shape] });
	}
	topFiveDataItems.sort((a, b) => {
		if (b.defect == a.defect) {
			if (b.waferShape.includes('+') && a.waferShape.includes('+')) {
				return 0;
			} else if (b.waferShape.includes('+')) {
				return -1;
			} else {
				return 1;
			}
		}
		return b.defect - a.defect;

	})
	console.log("topFiveDataItems:", topFiveDataItems);
	return topFiveDataItems;

}
const columns = [
	{ field: 'waferShape', headerName: 'Wafer Shape', width: 150 },
	{
		field: 'defect',
		headerName: 'Count',
		width: 100,
	}
]

const Login = () => {
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState('');
	const [selectedFile, setSelectedFile] = useState(undefined);
	const [similarityData, setSimilarityData] = useState([]);
	const [preview, setPreview] = useState()

	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined)
			return
		}

		const objectUrl = URL.createObjectURL(selectedFile)
		setPreview(objectUrl)

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl)
	}, [selectedFile])
	const uploadFile = (file) => {

		const data = new FormData();
		data.append('file', file);
		fetch('http://127.0.0.1:5000/check-similarity', {
			method: 'POST',
			body: data,
		}, { mode: 'no-cors' }).then((response) => {
			response.json().then((body) => {
				console.log(body);

				setSimilarityData(getTopFive(body));
				//this.setState({ imageURL: `http://localhost:8000/${body.file}` });
			});
		});

	}

	// const data1 = Array.from(data);

	const selectFiles = (event) => {
		console.log(event.target.files);
		setSelectedFile(event.target.files[0]);
		uploadFile(event.target.files[0])
		// setProgressInfos({ val: [] });
	};


	useEffect(() => {
		if (userRef?.current)
			userRef.current.focus();
	}, [])

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd])

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(user, pwd);
		setUser('');
		setPwd('');
		setSuccess(true);
	}



	const rows = [
	];

	const [value, setValue] = useState();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	function TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<Box sx={{ p: 3 }}>
						<Typography>{children}</Typography>
					</Box>
				)}
			</div>
		);
	}

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}


	return (
		<>
			{success ?
				<div>
					<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
						<Tabs value={value} onChange={handleChange} centered>
							<Tab label="CNN Model" {...a11yProps(0)} />
							<Tab label="YOLO V5 Model" />
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						<div style={{ textAlign: 'center' }}>
							<h1> Upload Wafer Image to detect Defect!</h1>
							<br />
							<Button variant="contained" component="label">
								Upload
								<input hidden accept="image/*" multiple type="file" onChange={selectFiles} />
							</Button>
							{similarityData && similarityData.length && <div style={{ display: 'flex', background: 'white', margin: 20 }}>
								<div style={{ height: 400, width: '500px', margin: 20 }}><DataGrid
									rows={similarityData}
									columns={columns}
									pageSize={5}
									rowsPerPageOptions={[5]}
								/></div>
								<div style={{ marginTop: 50, padding: 20 }}><img width={300} src={preview} /></div>
							</div>}
						</div>
					</TabPanel>
				</div>
				// <div>
				// 	<h1>Tabs Demo</h1>
				// 	<Tabs>
				// 		<div label="CNN Model" style={{ textAlign: 'center' }}>
				// 			<h1> Upload Wafer Image to detect Defect!</h1>
				// 			<br />
				// 			<Button variant="contained" component="label">
				// 				Upload
				// 				<input hidden accept="image/*" multiple type="file" onChange={selectFiles} />
				// 			</Button>
				// 			{similarityData && similarityData.length && <div style={{ display: 'flex', background: 'white', margin: 20 }}>
				// 				<div style={{ height: 400, width: '500px', margin: 20 }}><DataGrid
				// 					rows={similarityData}
				// 					columns={columns}
				// 					pageSize={5}
				// 					rowsPerPageOptions={[5]}
				// 				/></div>
				// 				<div style={{ marginTop: 50, padding: 20 }}><img width={300} src={preview} /></div>
				// 			</div>}
				// 		</div>
				// 		<div label="YOLOV5 Model">
				// 			After 'while, <em>Crocodile</em>!
				// 		</div>
				// 	</Tabs>
				// </div>
				// <section>
				// 	<h1> Welcome to Similarity Matching of Wafer Bin Maps</h1>
				// 	<div style={{ textAlign: 'center' }}>
				// 		<h1> Upload Wafer Image to detect Defect!</h1>
				// 		<br />
				// 		<Button variant="contained" component="label">
				// 			Upload
				// 			<input hidden accept="image/*" multiple type="file" onChange={selectFiles} />
				// 		</Button>
				// 	</div>
				// 	{similarityData && similarityData.length && <div style={{ display: 'flex', background: 'white', margin: 20 }}>
				// 		<div style={{ height: 400, width: '500px', margin: 20 }}><DataGrid
				// 			rows={similarityData}
				// 			columns={columns}
				// 			pageSize={5}
				// 			rowsPerPageOptions={[5]}
				// 		/></div>
				// 		<div style={{ marginTop: 50, padding: 20 }}><img width={300} src={preview} /></div>
				// 	</div>}
				// </section>


				: (
					<section>
						<div style={{ textAlign: 'center', height: 500, width: 300 }}>
							<div className="center" style={{ textAlign: 'center', margin: 20 }}>
								<p ref={errRef} className={errMsg ? "errmsg" :
									"offscreen"} aria-live="assertive">{errMsg}</p>
								<h1> Similarity Matching of Wafer Bin Map</h1>
								<h3>Group 5</h3>
								<form onSubmit={handleSubmit}>
									<div >
										<label htmlFor="username" >Username </label>
										<input type="text"
											value="298B Group_5"
											ref={userRef}
											autoComplete="off"
											onChange={(e) => setUser(e.target.value)}
											// value={user}
											required
										/>
									</div>
									<div style={{ margin: 20 }}>
										<label htmlFor="password" >Password </label>
										<input type="password"
											// value="SJSU"
											ref={userRef}
											autoComplete="off"
											onChange={(e) => setUser(e.target.value)}
											value={user}
											required
										/>
									</div>
									<div style={{ textAlign: 'center', margin: 30 }}>
										<button>Sign In</button>
									</div>
								</form>
							</div>
						</div>
					</section>
				)}
		</>
	)
}

export default Login