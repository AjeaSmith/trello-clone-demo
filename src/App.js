import { useState } from 'react';
import './App.css';
import _ from 'lodash';
import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 } from 'uuid';

const DragDropContextContainer = styled.div`
	padding: 20px;
	
	border: 4px solid indianred;
	border-radius: 6px;
	display: grid;
	grid-template-columns: repeat(5, auto);
	grid-gap: 8px;
`;

const ColumnHeader = styled.div`
	text-transform: uppercase;
	margin-bottom: 20px;
`;

const DroppableStyles = styled.div`
	padding: 10px;
	border-radius: 6px;
	background: #d4d4d4;
`;

const CardHeader = styled.div`
	font-weight: 500;
`;

const CardFooter = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const DragItem = styled.div`
	padding: 10px;
	border-radius: 6px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	background: white;
	margin: 0 0 8px 0;
	display: grid;
	grid-gap: 20px;
	flex-direction: column;
`;
const defaultFormFields = {
	candidatesToReview: '',
	Interviewing: '',
	notAMatch: '',
	noResponse: '',
	toBeHired: '',
};
function App() {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const [state, setState] = useState({
		candidatesToReview: {
			title: 'Candidates to review',
			items: [
				{
					id: v4(),
					name: 'James Steward',
					occupation: 'Web Developer',
					linkToProfile: 'https://www.google.com',
				},
				{
					id: v4(),
					name: 'Chris Michaels',
					occupation: 'Front-end Developer',
					linkToProfile: 'https://www.google.com',
				},
				{
					id: v4(),
					name: 'Tom Soho',
					occupation: 'Software Engineer',
					linkToProfile: 'https://www.google.com',
				},
			],
		},
		Interviewing: {
			title: 'Interviewing',
			items: [
				{
					id: v4(),
					name: 'Tom Soho',
					occupation: 'Software Engineer',
					linkToProfile: 'https://www.google.com',
				},
			],
		},
		notAMatch: {
			title: 'Not a match',
			items: [],
		},
		noResponse: {
			title: 'No response',
			items: [],
		},
		toBeHired: {
			title: 'To be hired',
			items: [],
		},
	});
	const handleDragEnd = ({ destination, source }) => {
		if (!destination) {
			return;
		}

		if (
			destination.index === source.index &&
			destination.droppableId === source.droppableId
		) {
			return;
		}

		// Creating a copy of item before removing it from state
		const itemCopy = { ...state[source.droppableId].items[source.index] };

		setState((prev) => {
			prev = { ...prev };

			// Remove from previous items array
			prev[source.droppableId].items.splice(source.index, 1);

			// Adding to new items array location
			prev[destination.droppableId].items.splice(
				destination.index,
				0,
				itemCopy
			);

			return prev;
		});
	};
	const addItem = (columnName) => {
		setState((prev) => {
			return {
				...prev,
				[columnName]: {
					title: prev[columnName].title,
					items: [
						{
							id: v4(),
							name: formFields[columnName],
						},
						...prev[columnName].items,
					],
				},
			};
		});
		setFormFields((prev) => {
			return {
				...prev,
				[columnName]: '',
			};
		});
	};
	const deleteItem = (columnName, draggableIndex) => {
		const newItems = [...state[columnName].items];
		newItems.splice(draggableIndex, 1);

		setState((prev) => {
			return {
				...prev,
				[columnName]: {
					title: prev[columnName].title,
					items: [...newItems],
				},
			};
		});
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};
	return (
		<DragDropContextContainer>
			<DragDropContext onDragEnd={handleDragEnd}>
				{_.map(state, (data, key) => {
					return (
						<DroppableStyles>
							<ColumnHeader>{data.title}</ColumnHeader>
							<Droppable droppableId={key}>
								{(provided) => {
									return (
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className={'droppable-col'}
										>
											{data.items.map((item, index) => {
												return (
													<Draggable
														key={item.id}
														index={index}
														draggableId={item.id}
													>
														{(provided) => {
															return (
																<DragItem
																	onDoubleClick={() =>
																		deleteItem(key, index)
																	}
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<CardHeader>
																		{item.name}
																	</CardHeader>
																	{item.occupation && (
																		<span>
																			{item.occupation}
																		</span>
																	)}
																	{item.linkToProfile && (
																		<CardFooter>
																			<a
																				href={`${item.linkToProfile}`}
																			>
																				{item.linkToProfile}
																			</a>
																		</CardFooter>
																	)}
																</DragItem>
															);
														}}
													</Draggable>
												);
											})}
											{provided.placeholder}
										</div>
									);
								}}
							</Droppable>
							<div>
								<input
									key={key}
									type="text"
									name={key}
									value={formFields[key]}
									onChange={handleChange}
								/>
								<button onClick={() => addItem(key)}>Add</button>
							</div>
						</DroppableStyles>
					);
				})}
			</DragDropContext>
		</DragDropContextContainer>
	);
}

export default App;
