// main tools
import { useState, useRef } from "react";
import { getSession } from "next-auth/react";
import dayjs from "dayjs";

// prime components
import { FileUpload, FileUploadSelectParams } from "primereact/fileupload";

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
	const [file, setFile] = useState<File | null>(null);
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

	const formatError = (user: string, message: string = "success") => ({
		status: "Error",
		user,
		message,
	});
	const formatSuccess = (user: string, message: string = "error") => ({
		status: "Success",
		user,
		message,
	});

	const uploadFile = async (ev: FileUploadHandlerParam): Promise<any> => {
		if (file) {
			setLoading(true);
			const formData: FormData = new FormData();
			formData.append("file", file);
			const res = await FamiliesService.uploadFamilyJsonFile(session.token, formData);
			if (res.status == 200) {
				setSuccess([...success, formatSuccess(session.user.email)] as any);
			} else {
				setErrors([...errors, formatError(session.user.email)] as any);
			}

			setLoading(false);
		}
	};

	const handleSelect = async (ev: FileUploadSelectParams) => {
		setErrors([]);
		setSuccess([]);

		const file = new File([ev.files[0]], dayjs().toISOString().concat(`-${ev.files[0].name}`), {
			type: ev.files[0].type,
		});

		setFile(file);
	};

	return (
		<Layout>
			<h1>Import Families</h1>
			<FileUpload
				name="families/import"
				uploadLabel="Import"
				customUpload={true}
				ref={fileuploader}
				uploadHandler={uploadFile}
				onSelect={handleSelect}
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
