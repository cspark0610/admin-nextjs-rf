// bootstrap components
import { Button, Col, Row } from 'react-bootstrap'

// prime components
import { Calendar, CalendarChangeParams } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

interface FollowUpAcctionParams {
	data: { actionType: string; comments: string; date: string | Date }
	handleSave: () => void
	dispatch: Dispatch<{
		payload: {
			ev: ChangeType | CalendarChangeParams | ChangeEvent<HTMLTextAreaElement>
			idx: number
		}
		type: string
	}>
	idx: number
}

export const FollowUpAcctionData: FC<FollowUpAcctionParams> = ({
	idx,
	data,
	dispatch,
	handleSave,
}) => {
	/**
	 * format Date
	 */
	const formatDate = (date: string | Date | undefined) =>
		typeof date === 'string' ? new Date(date) : date

	/**
	 * handle change and dispatch data
	 */
	const handleChange = (
		ev: ChangeType | CalendarChangeParams | ChangeEvent<HTMLTextAreaElement>,
		idx: number
	) =>
		dispatch({ type: 'handleFollowUpChange', payload: { ev, idx } })

	return (
		<Row key={idx} className={classes.container} >
			<Divider />
			<Col className={classes.col} xs={12}>
				<p>Action type</p>
				<InputText
					required
					name='actionType'
					value={data.actionType}
					placeholder='action type'
					className={classes.input}
					onChange={(ev) => handleChange(ev, idx)}
				/>
			</Col>
			<Col className={classes.col} xs={12}>
				<p>Date of verification</p>
				<Calendar
					showIcon
					name='date'
					appendTo='self'
					className='w-100'
					value={formatDate(data.date)}
					inputClassName={classes.input}
					placeholder='date of verification'
					onChange={(ev) => handleChange(ev, idx)}
				/>
			</Col>
			<Col className={classes.col} xs={12}>
				<p>Comments</p>
				<InputTextarea
					rows={6}
					name='comments'
					value={data.comments}
					className={classes.input}
					onChange={(ev)=> handleChange(ev, idx)}
				/>
			</Col>
			<Col>
				<Button className={classes.button} onClick={handleSave}>
					Save
				</Button>
			</Col>
		</Row>
	)
}
