import React, { createRef } from "react"
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import JoditEditor from "jodit-react";
import "react-datepicker/dist/react-datepicker.css";
import { createArticle, getArticleDraft, searchAuthors, searchCategories, updateArticle } from "../redux/services";
import Resizer from "react-image-file-resizer";
import AsyncSelect from 'react-select/async';
import { getInputClasses } from "../../../../helpers/getInputClasses";
import CustomDatePicker from "../../../../components/customDatePicker";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import _env from '../../../../env.json';
const appUrl = _env.appUrl;

class CreateArticle extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { id } } } = props;
        this.state = {
            article_id: id ? id : null,
            loading: false,
            initialValues: id ? null : {
                logo: '',
                title: '',
                subtitle: '',
                categories: [],
                authors: [],
                content: '',
                permalink: '',
                meta_title: '',
                meta_description: '',
                meta_keywords: '',
                posted_at: new Date(),
            },
            articleSchema: Yup.object().shape({
                logo: Yup.string()
                    .required("You should upload logo"),
                title: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    // .max(50, "Maximum 50 symbols")
                    .required("Title is required."),
                subtitle: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .required("Sub Title is required."),
                categories: Yup.array().of(Yup.object())
                    .min(1, "Article should have at least a category"),
                authors: Yup.array().of(Yup.object())
                    .min(1, "Article should have at least an author"),
                permalink: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    // .max(50, "Maximum 50 symbols")
                    .required("Type is required."),
                content: Yup.string()
                    .required("Content is required."),
                meta_title: Yup.string()
                    .max(84, "Meta title is maximum 84 symbols"),
                meta_description: Yup.string()
                    .max(140, "Meta title is maximum 140 symbols"),
                meta_keywords: Yup.string(),
                posted_at: Yup.date()
            }),
            isError: false,
            isSuccess: false,
            loadingCategories: false,
            loadingAuthors: false,
        }
        this.logoRef = createRef();
    }

    componentDidMount() {
        const { article_id } = this.state;
        if (article_id) {
            this.setState({ loading: true });
            getArticleDraft(article_id)
                .then(({ data }) => {
                    this.setState({
                        loading: false,
                        initialValues: {
                            logo: data.logo,
                            title: data.title,
                            subtitle: data.subtitle,
                            categories: data.categories.map(category => ({ label: category, value: category })),
                            authors: data.authors ? data.authors.map(author => ({ label: author.name, value: author.logo })) : [],
                            permalink: data.permalink,
                            content: data.content,
                            meta_title: data.meta_title,
                            meta_description: data.meta_description,
                            meta_keywords: data.meta_keywords,
                            posted_at: data.posted_at ? new Date(data.posted_at) : (new Date()),
                        }
                    })
                })
                .catch(() => {
                    this.setState({
                        loading: false,
                        initialValues: null
                    })
                })
        }
    }

    validateArticle = (values, formik) => {
        const { meta_title, meta_description, meta_keywords } = values;
        if (!meta_title || meta_title == '') {
            formik.setFieldError('meta_title', 'Meta Title is required for publish.');
            return false;
        }
        if (!meta_description || meta_description == '') {
            formik.setFieldError('meta_title', 'Meta Description is required for publish.');
            return false;
        }
        if (!meta_keywords || meta_keywords == '') {
            formik.setFieldError('meta_title', 'Meta Keywords are required for publish.');
            return false;
        }
        return true;
    }

    onSubmit = (values, formik) => {
        const { article_id } = this.state;
        if (article_id) {
            this.onUpdateArticle(values, formik);
        } else {
            this.onCreateArticle(values, formik);
        }
    }

    onCreateArticle = (values, formik) => {
        const { history } = this.props;
        if (!this.validateArticle(values, formik)) {
            formik.setSubmitting(false);
            return;
        }
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        const saveValue = {
            ...values,
            categories: values.categories.map((category) => category.value),
            authors: values.authors.map(author => ({ name: author.label, logo: author.value })),
            publish: true
        }
        createArticle(saveValue)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    onUpdateArticle = (values, formik) => {
        const { article_id } = this.state;
        const { history } = this.props;
        if (!this.validateArticle(values, formik)) {
            formik.setSubmitting(false);
            return;
        }
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        const saveValue = {
            ...values,
            categories: values.categories.map((category) => category.value),
            authors: values.authors.map(author => ({ name: author.label, logo: author.value })),
            publish: true
        }
        updateArticle(article_id, saveValue)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    onSaveDraft = (values, formik) => {
        const { article_id } = this.state;
        if (article_id) {
            this.onUpdateDraft(values, formik);
        } else {
            this.onCreateDraft(values, formik);
        }
    }

    onCreateDraft = (values, formik) => {
        const { history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        const saveValue = {
            ...values,
            categories: values.categories.map((category) => category.value),
            authors: values.authors.map(author => ({ name: author.label, logo: author.value })),
            publish: false
        }
        createArticle(saveValue)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    onUpdateDraft = (values, formik) => {
        const { article_id } = this.state;
        const { history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        const saveValue = {
            ...values,
            categories: values.categories.map((category) => category.value),
            authors: values.authors.map(author => ({ name: author.label, logo: author.value })),
            publish: false
        }

        updateArticle(article_id, saveValue)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    clickUploadButton = () => {
        this.logoRef.current.click();
    }

    handleFileUpload = async (e, formik) => {
        const file = e.target.files[0];
        const image = await this.resizeFile(file);
        formik.setFieldValue('logo', image);
    }

    resizeFile = (file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 600, 300, "png", 100, 0,
                (uri) => resolve(uri),
                "base64", 600, 300
            );
        });
    }

    getCategories = (name, cb) => {
        this.setState({ loadingCategories: true });
        searchCategories(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingCategories: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingCategories: false });
        })
    }

    getAuthors = (name, cb) => {
        this.setState({ loadingAuthors: true });
        searchAuthors(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingAuthors: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingAuthors: false });
        })
    }

    render() {
        const {
            initialValues, articleSchema,
            isError, isSuccess,
            loadingCategories, loadingAuthors,
            article_id, loading
        } = this.state;
        const config = {
            readonly: false,
            height: 350,
            enableDragAndDropFileToEditor: true,
            spellcheck: true,
            uploader: {
                insertImageAsBase64URI: true
            },
        };
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">{article_id ? 'Update an Article' : 'Create a New Article'}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {!loading && !initialValues && <center>
                                <h2>No Available data.</h2>
                            </center>}
                            {loading && <center>
                                <Preloader use={ThreeDots}
                                    size={100}
                                    strokeWidth={10}
                                    strokeColor="#F0AD4E"
                                    duration={800} />
                            </center>}
                            {initialValues && <Formik
                                validationSchema={articleSchema}
                                initialValues={initialValues}
                                onSubmit={this.onSubmit}>
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        {isError && (
                                            <div
                                                className="alert alert-custom alert-light-danger fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Update Failed
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div
                                                className="alert alert-custom alert-light-success fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-success">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Successfully Created.
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isSuccess: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <button type="button" className="btn btn-success mr-2" onClick={this.clickUploadButton}>Upload Logo File</button>
                                                <input ref={this.logoRef}
                                                    className={`form-control ${getInputClasses(formik, "logo")}`}
                                                    onChange={(e) => this.handleFileUpload(e, formik)} type="file"
                                                    style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />
                                                {formik.touched.logo && formik.errors.logo ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.logo}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <img src={formik.values.logo.startsWith('data:image/') ? formik.values.logo : `${appUrl}${formik.values.logo}`} style={{ width: '200px', height: 'auto', display: 'block' }} />
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Title<span className="text-danger">*</span></label>
                                                <input type="text" name="title"
                                                    className={`form-control ${getInputClasses(formik, "title")}`}
                                                    {...formik.getFieldProps("title")}
                                                    onChange={(evt) => {
                                                        formik.getFieldProps("title").onChange(evt);
                                                        const value = evt.target.value;
                                                        const permalink = value.toLowerCase()
                                                            .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                                                            .replace(/\s+/g, '-') // collapse whitespace and replace by -
                                                            .replace(/-+/g, '-');
                                                        formik.setFieldError('permalink', false);
                                                        formik.setFieldTouched('permalink', true);
                                                        formik.setFieldValue('permalink', permalink);
                                                    }}
                                                    placeholder="Title" />
                                                {formik.touched.title && formik.errors.title ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.title}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>PermaLink<span className="text-danger">*</span></label>
                                                <input type="text" name="permalink"
                                                    className={`form-control ${getInputClasses(formik, "permalink")}`}
                                                    {...formik.getFieldProps("permalink")}
                                                    placeholder="PermaLink" />
                                                {formik.touched.permalink && formik.errors.permalink ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.permalink}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Sub Title<span className="text-danger">*</span></label>
                                                <textarea type="text" name="subtitle"
                                                    className={`form-control ${getInputClasses(formik, "subtitle")}`}
                                                    rows={2}
                                                    {...formik.getFieldProps("subtitle")}
                                                    placeholder="Sub Title" />
                                                {formik.touched.subtitle && formik.errors.subtitle ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.subtitle}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Categories<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                className={`basic-single ${getInputClasses(formik, "categories")}`}
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                isMulti
                                                name="categories"
                                                loadOptions={this.getCategories}
                                                noOptionsMessage={() => "No Categories"}
                                                value={formik.values.categories}
                                                isLoading={loadingCategories}
                                                defaultOptions={true}
                                                {...formik.getFieldProps("categories")}
                                                onChange={(categories) => {
                                                    if (!categories) return;
                                                    formik.setFieldValue("categories", categories);
                                                    formik.setFieldTouched("categories", true);
                                                    formik.setFieldError("categories", false);
                                                }}
                                            />
                                            {formik.touched.categories && formik.errors.categories ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.categories}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="form-group">
                                            <label>Authors<span className="text-danger">*</span></label>
                                            <AsyncSelect
                                                className={`basic-single ${getInputClasses(formik, "authors")}`}
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                isMulti
                                                name="authors"
                                                loadOptions={this.getAuthors}
                                                noOptionsMessage={() => "No Authors"}
                                                value={formik.values.authors}
                                                isLoading={loadingAuthors}
                                                defaultOptions={true}
                                                {...formik.getFieldProps("authors")}
                                                onChange={(authors) => {
                                                    if (!authors) return;
                                                    formik.setFieldValue("authors", authors);
                                                    formik.setFieldTouched("authors", true);
                                                    formik.setFieldError("authors", false);
                                                }}
                                            />
                                            {formik.touched.authors && formik.errors.authors ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.authors}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Content<span className="text-danger">*</span></label>
                                                <JoditEditor
                                                    config={config}
                                                    name="content"
                                                    tabIndex={1} // tabIndex of textarea
                                                    {...formik.getFieldProps("content")}
                                                    {...{
                                                        onChange: (content) => {
                                                            formik.setFieldError("content", false);
                                                            formik.setFieldTouched("content", true);
                                                            formik.setFieldValue("content", content);
                                                        },
                                                        onBlur: (content) => {
                                                            formik.setFieldError("content", false);
                                                            formik.setFieldTouched("content", true);
                                                            // formik.setFieldValue("content", content);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <input className={`form-control ${getInputClasses(formik, "logo")}`}
                                                style={{ display: "none" }} />
                                            {formik.touched.content && formik.errors.content ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.content}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Posted At <span className="text-danger">*</span></label>
                                            <CustomDatePicker
                                                name="posted_at"
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy HH:mm aa"
                                                className="form-control"
                                                wrapperClassName="input-group"
                                                selected={formik.values.posted_at}
                                                {...formik.getFieldProps("posted_at")}
                                                {...{
                                                    onChange: (posted_at) => {
                                                        formik.setFieldError("posted_at", false);
                                                        formik.setFieldTouched("posted_at", true);
                                                        formik.setFieldValue("posted_at", posted_at);
                                                    },
                                                }}
                                                isInvalid={formik.errors.posted_at !== undefined}
                                                required
                                            />
                                            {formik.touched.posted_at && formik.errors.posted_at ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.posted_at}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Meta Title</label>
                                                <input type="text" name="meta_title"
                                                    className={`form-control ${getInputClasses(formik, "meta_title")}`}
                                                    {...formik.getFieldProps("meta_title")}
                                                    placeholder="Meta Title" />
                                                <span className="mt-1 ml-1 text-muted">{formik.values.meta_title.length} Out of 84 Characters</span>
                                                {formik.touched.meta_title && formik.errors.meta_title ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.meta_title}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Meta Keywords</label>
                                                <input type="text" name="meta_keywords"
                                                    className={`form-control ${getInputClasses(formik, "meta_keywords")}`}
                                                    {...formik.getFieldProps("meta_keywords")}
                                                    placeholder="Meta Keywords" />
                                                {formik.touched.meta_keywords && formik.errors.meta_keywords ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.meta_keywords}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Meta Description</label>
                                                <textarea type="text" name="meta_description"
                                                    className={`form-control ${getInputClasses(formik, "meta_description")}`}
                                                    rows={5}
                                                    {...formik.getFieldProps("meta_description")}
                                                    placeholder="Meta Description" />
                                                <span className="mt-1 ml-1 text-muted">{formik.values.meta_description.length} Out of 140 Characters</span>
                                                {formik.touched.meta_description && formik.errors.meta_description ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.meta_description}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Publish</button>
                                            <button type="button" className="btn btn-success mr-2" disabled={formik.isSubmitting} onClick={() => this.onSaveDraft(formik.values, formik)}>Save as a Draft</button>
                                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                                        </div>
                                    </form>
                                }}
                            </Formik>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateArticle;