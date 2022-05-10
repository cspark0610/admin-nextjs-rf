// main tools
import { useState, useRef } from "react";
import { getSession } from "next-auth/react";
import dayjs from "dayjs";

// prime components
import { FileUpload } from "primereact/fileupload";

// components
import { Layout } from "components/Layout";
import { emptyTemplate } from "components/UI/Atoms/uploadFiles/emptyTemplate";
import { itemTemplate } from "components/UI/Atoms/uploadFiles/itemTemplate";
import { ResumeTable } from "components/UI/Atoms/uploadFiles/resumeTable";

// services
import { FamiliesService } from "services/Families";

// styles
import classes from "styles/Families/import.module.scss";

// types
import { NextPage, GetServerSidePropsContext } from "next";
import { FileUploadHandlerParam } from "primereact/fileupload";

const ImportFamiliesPage: NextPage<{ session: any }> = ({ session }) => {
	const [errors, setErrors] = useState([]);
	const [success, setSuccess] = useState([]);
	const [loading, setLoading] = useState(false);
	const acceptedFiles = "application/json";
	const fileuploader = useRef(null);

	const chooseOptions = {
		icon: "pi pi-fw pi-file",
		className: "p-button-rounded p-button-outlined",
	};
	const uploadOptions = {
		icon: "pi pi-fw pi-cloud-upload",
		className: "p-button-success p-button-rounded p-button-outlined",
	};
	const cancelOptions = {
		icon: "pi pi-fw pi-times",
		className: "p-button-danger p-button-rounded p-button-outlined",
	};

	const formatError = (user: string, message: string) => ({
		status: "Error",
		user,
		message,
	});
	const formatSuccess = (user: string, message: string) => ({
		status: "Success",
		user,
		message,
	});

	const uploadFile = async (importFile: File): Promise<any> => {
		let formData: FormData = new FormData();
		formData.append("file", importFile);
		console.log(formData, "aa");

		const res = await FamiliesService.uploadFamilyJsonFile(session.token, formData);
		console.log(res, "res");
	};

	const handleUpload = async (ev: FileUploadHandlerParam) => {
		setErrors([]);
		setSuccess([]);
		const file: File = new File([ev.files[0]], dayjs().toISOString().concat(` - ${ev.options.props.name}`));
		console.log(file, "file");
		if (ev.options.props.accept == acceptedFiles) {
			setLoading(true);
			const res = await uploadFile(file);
			// if (res.status == 200) {
			// 	setSuccess([...success, formatSuccess(session.user.email, res.data.message)] as any);
			// } else {
			// 	setErrors([...errors, formatError(session.user.email, res.data.message)] as any);
			// }
			setLoading(false);
		}
	};

	return (
		<Layout>
			<h1>Import Families</h1>
			<FileUpload
				name="families/import"
				uploadLabel="Import"
				customUpload={true}
				ref={fileuploader}
				uploadHandler={handleUpload}
				emptyTemplate={emptyTemplate}
				accept={acceptedFiles}
				chooseOptions={chooseOptions}
				uploadOptions={uploadOptions}
				cancelOptions={cancelOptions}
				className={classes.uploader}
			/>
			<ResumeTable loading={loading} value={[...errors, ...success]} />
		</Layout>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getSession(ctx);
	if (!session) return { redirect: { destination: "/login", permanent: false } };

	return { props: { session } };
};

export default ImportFamiliesPage;
