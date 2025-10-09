export default function FormField(params) {
  return (
    <div className="form-group">
      <label htmlFor={params.id} className="form-label">
        {params.fieldName}
      </label>
      <input
        name={params.name}
        id={params.id}
        type={params.fieldType}
        className={"form-input" || params.className}
        value={params.value}
        onChange={params.onChange}
        required={params.required}
      />
    </div>
  );
}
