import { PermissionsService } from './permissions.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'permissioncheck'
})

export class PermissionCheckPipe implements PipeTransform {
    constructor(private permissionService: PermissionsService){}
    transform(permissionName: string): boolean {
        return this.permissionService.hasPermission(permissionName);
    }
}
