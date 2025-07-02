import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { EditableField } from "./page";

type Props = {
  label: string;
  fieldKey: EditableField;
  value: string;
  editingField: string;
  onEdit: (field: EditableField, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  fieldValue: string;
  setFieldValue: (val: string) => void;
  allowEdit?: boolean;
};

export default function EditableElem({
  label,
  fieldKey,
  value,
  editingField,
  onEdit,
  onSave,
  onCancel,
  fieldValue,
  setFieldValue,
  allowEdit = true,
}: Props) {
  const isEditing = editingField === fieldKey;

  return (
    <div className="space-y-3">
      <Label className="text-xl font-medium text-mcmaster-maroon">{label}</Label>
      <div className="relative">
        <Input
          value={isEditing ? fieldValue : value}
          onChange={(e) => isEditing && setFieldValue(e.target.value)}
          className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-24 rounded-full w-full"
          readOnly={!isEditing}
        />

        {allowEdit &&
          (isEditing ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button onClick={onSave} variant="ghost" size="icon" className="text-green-600 hover:text-green-700 h-10 w-10">
                <Check className="w-5 h-5" />
              </Button>
              <Button onClick={onCancel} variant="ghost" size="icon" className="text-red-600 hover:text-red-700 h-10 w-10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onEdit(fieldKey, value)}
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
            >
              <Edit className="w-5 h-5" />
            </Button>
          ))}
      </div>
    </div>
  );
}
