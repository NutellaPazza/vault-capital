import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApplicationFormData } from '@/pages/ApplyPage';
import { FileText, Play, FolderOpen } from 'lucide-react';

interface Props {
  data: ApplicationFormData;
  updateData: (updates: Partial<ApplicationFormData>) => void;
  errors: Record<string, string>;
}

export const FormStepMaterials = ({ data, updateData, errors }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <Label htmlFor="deck_url">Pitch Deck URL *</Label>
          </div>
          <Input
            id="deck_url"
            type="url"
            value={data.deck_url}
            onChange={(e) => updateData({ deck_url: e.target.value })}
            placeholder="https://docsend.com/view/your-deck or Google Drive link"
          />
          {errors.deck_url && <p className="text-sm text-destructive">{errors.deck_url}</p>}
          <p className="text-xs text-muted-foreground">
            Accepted: Notion, Docsend, Google Drive, Dropbox links
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="demo_url">Demo / Product URL (optional)</Label>
          </div>
          <Input
            id="demo_url"
            type="url"
            value={data.demo_url}
            onChange={(e) => updateData({ demo_url: e.target.value })}
            placeholder="https://yourapp.com or video demo link"
          />
          <p className="text-xs text-muted-foreground">
            Link to your live product, prototype, or demo video
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="data_room_url">Data Room URL (optional)</Label>
          </div>
          <Input
            id="data_room_url"
            type="url"
            value={data.data_room_url}
            onChange={(e) => updateData({ data_room_url: e.target.value })}
            placeholder="https://notion.so/dataroom or shared folder link"
          />
          <p className="text-xs text-muted-foreground">
            Link to additional materials: financials, contracts, team bios, etc.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Ensure your deck link is accessible (not password-protected or with sharing restrictions). 
          We'll reach out if we have trouble accessing your materials.
        </p>
      </div>
    </div>
  );
};
