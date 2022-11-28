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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import login_background from './BackGround Image/login_background.jpg';
import Model from './BackGround Image/Model.jpg';
import Yolo from './BackGround Image/Yolo.jpg';





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
							<Tab label="YOLO V5 Model" {...a11yProps(1)} />
							<Tab label="About" {...a11yProps(2)} />
							<Tab label="Data Collection" {...a11yProps(3)} />
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						<h1 style={{ textAlign: 'Center', margin: 5 }}> Upload Wafer Image to detect Defect!</h1>
						<div style={{
							textAlign: 'center', backgroundImage: `url(${Model})`, backgroundSize: 'cover',
							overflow: 'hidden', backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center', height: 700
						}}>
							<br />
							<Button variant="contained" component="label" style={{ margin: 10 }} >
								Upload
								<input hidden accept="image/*" multiple type="file" onChange={selectFiles} />
							</Button>
							{similarityData && similarityData.length && <div style={{ display: 'flex', background: 'white', margin: 'auto', width: '800px' }}>
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
					<TabPanel value={value} index={1}>
						<div style={{
							textAlign: 'center', backgroundImage: `url(${Yolo})`, backgroundSize: 'cover',
							overflow: 'hidden', backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center', height: 700
						}}>
							<h1>Hello</h1>
						</div>
					</TabPanel>
					<TabPanel value={value} index={2} >
						<div style={{ display: 'flex', textAlign: 'center', justifyContent: 'normal' }}>
							<text>Wafers can be defined as thin slices of semiconductors
								like silicon c-Si that have wide applications in integrated circuits,
								solar cells, etc. Wafer manufacturing in the semiconductor industry
								deals with many microfabrication processes like doping, ion implantation,
								etching, photolithographic patterning, wafer dicing, packaging, etc.
								Thereby making the entire process complicated and time-consuming.
								Additionally, when wafer fabrication facilities are inspected
								it is surprising to see that around 10% of the wafers will be
								defective thereby making the yield optimization to be of
								high importance in the semiconductor manufacturing industry.
								Any spatial defect patterns in wafer maps represent a problem in
								the manufacturing and testing process and are required to be identified.
								Wafer bin map (WBM) represents specific failure patterns that aid in identifying
								the faulty wafers thereby empowering the wafer manufacturing industry.
								Industries can use our project or model to detect the defect of the wafer tp avoid any
								interruptions to their research later.</text>
						</div>
					</TabPanel>
					<TabPanel value={value} index={3}>
						<div>

							<p>
								We collected a large amount of WBMs in a wafer manufacturing plant that was
								made available publicly for the researchers. Through test probes,
								these maps of wafer performance were generated based on electrical testing of
								each die on the wafer. Our dataset was collected from two different sources:
							</p>

							<p>
								Dataset MixedWM38:

								This Dataset (Wafer Map) has around 38000 wafer maps, including 1 normal pattern,
								8 single defect patterns, and 29 mixed defect patterns.
								This dataset was helpful in assisting the research because more mixed-type defects
								helped in determining the root cause of it.
								The data file format is npz (file format by numpy to store array data using gzip)
								and data size is around 2GB. There were two sets of arrays in the dataset.
								‘Arr_0’ is the defect data of a mixed-type wafer map, 0 means ‘blank spot’,
								1 represents ‘normal die’, and 2 represents ‘broken die’ that passed and failed
								the electrical test respectively. The data (nparray) shape was (52, 52).
							</p>

							<p>
								Dataset WM-811K

								This public dataset is provided by MIR lab. There are a total of 811457 wafer maps
								collected from 46,393 lots in real world fabrication.
								Various single type defect patterns are available in this dataset like Center,
								Donut, Edge-Loc, Edge-Ring, Loc, Random, Scratch, Near-full and none.
								The datafile is in pickle format and data size is around 3GB.

							</p>

						</div>

					</TabPanel>
				</div>

				: (
					<section>
						<h1 style={{ color: 'Black', textAlign: 'center' }}>Similarity Matching of Wafer Bin Map</h1>
						<div style={{
							textAlign: 'center', height: 700, backgroundImage: `url(${login_background})`, backgroundSize: 'cover',
							overflow: 'hidden', backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center'
						}}>
							<div className="center" style={{ textAlign: 'center', margin: 20 }}>
								<p ref={errRef} className={errMsg ? "errmsg" :
									"offscreen"} aria-live="assertive">{errMsg}</p>
								<h1> Login Here</h1>
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