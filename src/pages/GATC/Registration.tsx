import { Button } from "antd";
import { useState } from "react";
import CustomSelect from "../../components/ui/CustomSelector";
import { MAJOR_FOCUS_OPTIONS } from "../../constants/gatcRegistration.data";



export default function GatcRegistration() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <div>
      <h1>GatcRegistration</h1>
      <CustomSelect
        mode="multiple"
        className=""
        options={MAJOR_FOCUS_OPTIONS}
        value={values}
        onChange={(val) => setValues(val as string[])}
      />
      <Button onClick={() => console.log(values)}>Submit</Button>
    </div>
  );
}
