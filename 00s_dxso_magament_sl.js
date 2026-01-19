/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([],
    () => {

        const CUSTOM_RECORD_ID = 'customrecord_custom_transaction';
        const CUSTOM_ITEM_LINE_ID = 'customrecord_custom_item_line';
        const PARENT_FIELD_ID = 'custrecord_dxso_parent_invoice';
        const CUSTOM_RECORD_ID_LIST = 4692;
        const MR_SCRIPT_ID = 'customscript_00_dxso_create_tran_mr';
        const MR_DEPLOYMENT_ID = 'customdeploy_00_dxso_create_tr_dep';
        const SL_SCRIPT_ID = 8206;
        const SL_DEP_ID = 1;

        const STATUS = {
            GENERATED: '1',
            PROCESSED: '2',
            ERROR: '3',
            EDITED: '4'
        };

        const EDIT_ROLES_PARAM = 'custscript_dxso_edit_roles_mapping';

        const FIELD_DEFS = [
            {
                id: 'name',
                label: 'External ID',
                type: ui.FieldType.TEXT,
                section: 'main',
                mandatory: true
                //    defaultOverride: 'Auto-generated draft'
            },
            {
                id: 'custrecord_dxso_transaction_type',
                label: 'NS Transaction Type',
                type: ui.FieldType.SELECT,
                section: 'main',
                options: [
                    { value: '7', text: 'Invoice' },
                    { value: '10', text: 'Credit Memo' },
                    { value: '116', text: 'Debit Memo' }
                ]
            },
            {
                id: 'custrecord_dxso_entity',
                label: 'Customer:project',
                type: ui.FieldType.SELECT,
                source: 'customer',
                section: 'main',
                mandatory: true,
                displayType: ui.FieldDisplayType.DISABLED
            },
            {
                id: 'custrecord_dxso_account',
                label: 'Account',
                type: ui.FieldType.SELECT,
                source: 'account',
                section: 'main',
                displayType: ui.FieldDisplayType.DISABLED
            },
            // {
            //     id: 'custrecord_dxso_00_transaction_type',
            //     label: 'Transaction Type',
            //     type: ui.FieldType.SELECT,
            //     source: 'customrecord_00_transaction_types',
            //     section: 'main'
            // },
            {
                id: 'custrecord_dxso_postingperiod',
                label: 'Posting Period',
                type: ui.FieldType.SELECT,
                source: 'accountingperiod',
                section: 'main'
            },
            {
                id: 'custrecord_dxso_trandate',
                label: 'Tax Date',
                type: ui.FieldType.DATE,
                section: 'main'
            },
            {
                id: 'custrecord_dxso_cb_issue_date',
                label: 'Issue Date',
                type: ui.FieldType.DATE,
                section: 'main'
            },
            {
                id: 'custrecord_dxso_duedate',
                label: 'Due Date',
                type: ui.FieldType.DATE,
                section: 'main',
            },
            {
                id: 'custrecord_dxso_terms',
                label: 'Terms',
                type: ui.FieldType.SELECT,
                source : 'term',
                section: 'main',
                breakType: ui.FieldBreakType.STARTCOL,
                displayType: ui.FieldDisplayType.DISABLED
            },
            {
                id: 'custrecord_dxso_currency',
                label: 'Currency',
                type: ui.FieldType.SELECT,
                source: 'currency',
                section: 'main',
                displayType: ui.FieldDisplayType.DISABLED
            },
            {
                id: 'custrecord_dxso_exchangerate',
                label: 'Exchange Rate',
                type: ui.FieldType.FLOAT,
                section: 'main'
            },
            {
                id: 'custrecord_dxso_memo',
                label: 'Memo',
                type: ui.FieldType.TEXTAREA,
                section: 'main'
            },
            {
                id: 'custrecord_dxso_refno_originvoice',
                label: 'Reference No. of Original Invoice',
                type: ui.FieldType.TEXT,
                section: 'main',
                //    defaultOverride: 'Auto-generated draft'
            },
            {
                id: 'custrecord_dxso_description',
                label: 'Description',
                type: ui.FieldType.TEXTAREA,
                section: 'main'
            },
            {
                id: 'custrecord_dxso_eset_new_message',
                label: 'Print Message',
                type: ui.FieldType.TEXTAREA,
                section: 'main',
                //    defaultOverride: 'Auto-generated draft'
                breakType: ui.FieldBreakType.STARTCOL
            },
            {
                id: 'custrecord_dxso_message',
                label: 'Customer Message',
                type: ui.FieldType.TEXTAREA,
                section: 'main',
            //    defaultOverride: 'Auto-generated draft'
            },
            {
                id: 'custrecord_dxso_billaddress',
                label: 'Customer Address',
                type: ui.FieldType.TEXTAREA,
                section: 'main',
                displayType: ui.FieldDisplayType.DISABLED
            },
            {
                id: 'custrecord_dxso_00_language',
                label: 'Language',
                type: ui.FieldType.SELECT,
                source: 'customlist_sf_list_preferred_language',
                section: 'other'
            },
            {
                id: 'custrecord_dxso_external_reference',
                label: 'EXTERNAL REFERENCE SOURCE',
                type: ui.FieldType.SELECT,
                source: 'customlist_external_reference_source',
                section: 'other',
                displayType: ui.FieldDisplayType.DISABLED
                //    defaultOverride: 'Auto-generated draft'
            },
            {
                id: 'custrecord_dxso_pairedtransaction',
                label: 'Paired Transaction',
                type: ui.FieldType.SELECT,
                source: 'transaction',
                section: 'other'
            },
            {
                id: 'custrecord_dxso_status',
                label: 'DXSO Status',
                type: ui.FieldType.SELECT,
                source: 'customlist_salesforce_status',
                section: 'other',
                displayType: ui.FieldDisplayType.DISABLED
            },
            {
                id: 'custrecord_dxso_error',
                label: 'Posting Transaction Creation Error',
                type: ui.FieldType.TEXTAREA,
                section: 'other',
                displayType: ui.FieldDisplayType.DISABLED
            },
        ];

        const ITEM_SUBLIST_DEFS = {
            id: 'custpage_itemlist',
            label: 'Item Lines',
            type: ui.SublistType.INLINEEDITOR,
            fields: [
                { id: 'line_id', label: 'Line ID', type: ui.FieldType.TEXT, displayType: ui.FieldDisplayType.HIDDEN, sourceRecordField: 'internalid' },
                { id: 'item', label: 'Item', type: ui.FieldType.SELECT, source: 'item', sourceRecordField: 'custrecord_dxso_item' },
                { id: 'description', label: 'Description', type: ui.FieldType.TEXTAREA, sourceRecordField: 'custrecord_dxso_item_description' },
                { id: 'quantity', label: 'Quantity', type: ui.FieldType.FLOAT, sourceRecordField: 'custrecord_dxso_item_quantity' },
                { id: 'rate', label: 'Rate', type: ui.FieldType.CURRENCY, sourceRecordField: 'custrecord_dxso_item_rate' },
                { id: 'amount', label: 'Amount', type: ui.FieldType.CURRENCY, sourceRecordField: 'custrecord_dxso_item_amount' },
                { id: 'tax_code', label: 'Tax Code', type: ui.FieldType.SELECT, source: 'salestaxitem', sourceRecordField: 'custrecord_dxso_item_tax_code' },
                { id: 'tax_rate', label: 'Tax Rate', type: ui.FieldType.PERCENT, displayType: ui.FieldDisplayType.DISABLED, sourceRecordField: 'custrecord_dxso_item_tax_rate' },
                { id: 'tax_amount', label: 'Tax Amt', type: ui.FieldType.CURRENCY, sourceRecordField: 'custrecord_dxso_item_tax_amount' },
                { id: 'total', label: 'Total', type: ui.FieldType.CURRENCY, sourceRecordField: 'custrecord_dxso_item_total' },
                { id: 'department', label: 'Department', type: ui.FieldType.SELECT, source: 'department', sourceRecordField: 'custrecord_dxso_item_department' },
                { id: 'class', label: 'Class', type: ui.FieldType.SELECT, source: 'classification', sourceRecordField: 'custrecord_dxso_item_class' }
            ]
        };

        const ITEM_SEARCH_CONFIG = {
            type: CUSTOM_ITEM_LINE_ID,
            filterField: PARENT_FIELD_ID,
            columns: ITEM_SUBLIST_DEFS.fields.map(f => f.sourceRecordField || f.id).filter(Boolean)
        };


        function onRequest(context) {
            if (context.request.method === 'GET') {
                const invoiceId = context.request.parameters.custparam_invoiceid;
                const mode = (context.request.parameters.custparam_mode || 'view').toLowerCase();
                if (['edit','new','copy','delete'].includes(mode) && !isEditRole()) {
                    denyAccess(context.response);
                    return;
                }

                // log.debug('DXSO Suitelet INIT', {
                //     method: context.request.method,
                //     mode: context.request.parameters.custparam_mode,
                //     invoiceId: context.request.parameters.custparam_invoiceid
                // });


                if (mode === 'process') {
                    try {
                        handleProcessSingleRecord(context.request, context.response);
                        return;
                    } catch (err) {
                        log.error('Process Error', err);
                        // Optional: show form with error instead of hard fail
                        throw err;
                    }
                }

                let invoiceRec;
                let isNew = false;
                let isCopy = false;
                let isEdit = false;
                let isDelete = false;
                let isView = false;


                switch (mode) {
                    case 'view':
                        if (!invoiceId) throw 'Missing invoiceId for view mode.';
                        invoiceRec = record.load({ type: CUSTOM_RECORD_ID, id: invoiceId });
                        isView = true;
                        break;

                    case 'edit':
                        if (!invoiceId) throw 'Missing invoiceId for edit mode.';
                        invoiceRec = record.load({ type: CUSTOM_RECORD_ID, id: invoiceId });
                        isEdit = true;
                        break;

                    case 'copy':
                        if (!invoiceId) throw 'Missing invoiceId for copy mode.';
                        invoiceRec = record.copy({ type: CUSTOM_RECORD_ID, id: invoiceId });
                        isCopy = true;


                        const copiedFields = invoiceRec.getFields();
                        const copiedValues = {};

                        copiedFields.forEach(fid => {
                            try {
                                copiedValues[fid] = invoiceRec.getValue({ fieldId: fid });
                            } catch (e) {
                                copiedValues[fid] = '[Error getting value]';
                            }
                        });

                        log.debug('Copied record field values', copiedValues);


                        invoiceRec.setValue({ fieldId: 'custrecord_dxso_pairedtransaction', value: '' });
                        invoiceRec.setValue({ fieldId: 'custrecord_dxso_external_reference', value: 7 });
                        invoiceRec.setValue({ fieldId: 'custrecord_dxso_status', value: STATUS.EDITED });
                        invoiceRec.setValue({ fieldId: 'custrecord_dxso_error', value: '' });

                        break;

                    case 'new':
                        invoiceRec = record.create({ type: CUSTOM_RECORD_ID });
                        invoiceRec.setValue({ fieldId: 'custrecord_dxso_external_reference', value: 7 });
                        isNew = true;
                        break;

                    case 'delete':
                        isDelete = true;
                        break;

                    default:
                        throw 'Invalid or missing mode parameter.';
                }

                log.debug('GET Mode Details', {
                    isNew,
                    isCopy,
                    isEdit,
                    isView,
                    isDelete,
                    invoiceId
                });

                // log.debug('Loaded or copied record', {
                //     internalId: invoiceRec.id,
                //     type: invoiceRec.type
                // });


                if (context.request.method === 'GET' && isDelete) {

                    const invoiceId = context.request.parameters.custparam_invoiceid;
                    if (!invoiceId) throw 'Missing invoiceId for delete mode.';

                    deleteInvoiceWithLines(invoiceId, context);
                    return;
                }

                const form = ui.createForm({ title: 'Transaction Draft' });

                const errorMsg = context.request.parameters.custparam_error;

                if (errorMsg) {
                    form.addField({
                        id: 'custpage_error_banner',
                        type: ui.FieldType.INLINEHTML,
                        label: 'Error'
                    }).defaultValue = `<div style="color: red; background-color: #ffe6e6; padding: 10px; margin-bottom: 10px; font-weight: bold; border-radius: 6px;">
                     ⚠️ ${decodeURIComponent(errorMsg)}
                     </div>`;
                }

                let pairedTransactionVal = null;
                if (!isNew && !isDelete) {
                    try {
                        pairedTransactionVal = invoiceRec.getValue({ fieldId: 'custrecord_dxso_pairedtransaction' });
                    } catch (e) {
                        log.debug('pairedTransaction not available yet', e.message);
                    }
                }


                if (!isNew && !isCopy && !isView && !pairedTransactionVal) {
                    form.addButton({
                        id: 'custpage_delete',
                        label: '❌ Delete',
                        functionName: 'deleteRecord'
                    });
                }

                form.addField({
                    id: 'custpage_invoiceid',
                    label: 'Invoice ID',
                    type: ui.FieldType.TEXT
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = isCopy ? invoiceId : (isNew ? '' : invoiceId);

                form.addField({
                    id: 'custparam_mode',
                    label: 'Mode',
                    type: ui.FieldType.TEXT
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = mode;


                try {
                    let tranType = 'Transaction';

                    if (!isNew) {
                        try {
                            const val = invoiceRec.getValue({ fieldId: 'custrecord_dxso_transaction_type' });
                            if (val) {
                                tranType = invoiceRec.getText({ fieldId: 'custrecord_dxso_transaction_type' }) || 'Transaction';
                            }
                        } catch (e) {
                            log.debug('No tranType for record yet', e.message);
                        }
                    }

                    const allowedTypes = ['Invoice', 'Credit Memo', 'Debit Memo'];
                    const labelSuffix = allowedTypes.includes(tranType) ? tranType : 'Transaction';

                    if (isNew) {
                        form.title = `Create ${labelSuffix} Dexter SO`;
                    } else if (isCopy) {
                        form.title = `Copy ${labelSuffix} Dexter SO`;
                    } else if (isView) {
                        form.title = `View ${labelSuffix} Dexter SO`;
                    } else {
                        form.title = `Edit ${labelSuffix} Dexter SO`;
                    }

                    //const fieldIds = invoiceRec.getFields();
                    // log.debug('fields:', JSON.stringify(fieldIds));

                    // === GROUPS ===
                    form.addFieldGroup({ id: 'main', label: 'Main Fields' });
                    form.addFieldGroup({ id: 'summary', label: 'Summary Fields' });
                    form.addFieldGroup({ id: 'other', label: 'Other Fields' });
                    form.addFieldGroup({ id: 'lineinfo', label: 'Line Summary'});

                    form.clientScriptModulePath = './00s_dxso_suitelet_validation_cs.js';

                    FIELD_DEFS.forEach(def => {
                        addFieldDynamic(form, invoiceRec, def, isView, mode);
                    });


                    // === SUBLIST: ITEM LINES ===
                    const sublist = form.addSublist({
                        id: ITEM_SUBLIST_DEFS.id,
                        type: isView ? ui.SublistType.LIST : ITEM_SUBLIST_DEFS.type,
                        label: ITEM_SUBLIST_DEFS.label
                    });

                    ITEM_SUBLIST_DEFS.fields.forEach(field => {
                        if (isView && field.id === 'line_id') return;
                        let f;

                        if (isView) {
                            sublist.addField({
                                id: field.id,
                                type: ui.FieldType.TEXT,
                                label: field.label
                            });
                        } else {
                            const fieldConfig = {
                                id: field.id,
                                type: field.type,
                                label: field.label
                            };

                            if (field.source) {
                                fieldConfig.source = field.source;
                            }

                            f = sublist.addField(fieldConfig);

                            if (field.displayType) {
                                f.updateDisplayType({ displayType: field.displayType });
                            }
                        }
                    });

                    let itemLines = [];

                    if (!isNew) {
                        itemLines = search.create({
                            type: ITEM_SEARCH_CONFIG.type,
                            filters: [[ITEM_SEARCH_CONFIG.filterField, 'is', invoiceId]],
                            columns: ITEM_SEARCH_CONFIG.columns
                        }).run().getRange({ start: 0, end: 1000 });
                    }

                    if (isCopy) {
                        itemLines.forEach(line => {
                            line.getValue = ((orig => col => {
                                if (col === 'internalid') return ''; // delete line_id
                                return orig.call(line, col);
                            }))(line.getValue);
                        });
                    }

                    if (!isNew) {
                        populateSublist(sublist, itemLines, ITEM_SUBLIST_DEFS, isView);
                    }

                    form.addField({
                        id: 'custpage_item_count',
                        type: ui.FieldType.INLINEHTML,
                        label: 'Item Count',
                        container: 'lineinfo'
                    }).defaultValue = `
                        <div id="item-count-field" style="margin-top:10px; font-weight:bold; font-size:14px;">
                            📦 Total Item Lines: ${itemLines.length}
                        </div>
                    `;


                    // === CALCULATE SUMMARY TOTALS ===
                    let subtotal = 0;
                    let totalTax = 0;
                    let total = 0;

                    for (let i = 0; i < itemLines.length; i++) {
                        const res = itemLines[i];
                        subtotal += parseFloat(res.getValue('custrecord_dxso_item_amount')) || 0;
                        totalTax += parseFloat(res.getValue('custrecord_dxso_item_tax_amount')) || 0;
                        total += parseFloat(res.getValue('custrecord_dxso_item_total')) || 0;
                    }

                    const summaryHtml = `
                          <style>
                           .summary-box {
                              float: left;
                              width: 300px;
                              padding: 12px 16px;
                              border: 1px solid #ccc;
                              border-radius: 6px;
                              font-family: Arial, sans-serif;
                              background-color: #f9f9f9;
                              margin-top: 12px;
                              margin-right: 16px;
                            }
                            .summary-box h3 {
                              margin-top: 0;
                              margin-bottom: 10px;
                              font-size: 15px;
                              font-weight: bold;
                              color: #333;
                            }
                            .summary-box .row {
                              display: flex;
                              justify-content: space-between;
                              margin-bottom: 6px;
                              font-size: 14px;
                              color: #333;
                            }
                            .summary-box .total {
                              font-weight: bold;
                              font-size: 15px;
                            }
                            .summary-box .divider {
                              border-top: 1px solid #ccc;
                              margin: 8px 0;
                            }
                          </style>
                          <div class="summary-box">
                            <h3>Summary</h3>
                            <div class="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div class="row"><span>Tax Total</span><span>${totalTax.toFixed(2)}</span></div>
                            <div class="row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            <div class="divider"></div>
                            <div class="row"><span>Amount Due</span><span>${total.toFixed(2)}</span></div>
                          </div>
                        `;

                    form.addField({
                        id: 'custpage_summary_block',
                        label: 'Summary Totals',
                        type: ui.FieldType.INLINEHTML,
                        container: 'summary',
                    }).defaultValue = summaryHtml;

                    // if (!isView) {
                    //     form.addSubmitButton({ label: `💾 Save ${labelSuffix}` });
                    // }
                    if (!isView) {
                        const saveLabel = isCopy
                            ? `💾 Save Copy of ${labelSuffix}`
                            : `💾 Save ${labelSuffix}`;

                        form.addSubmitButton({ label: saveLabel });
                    }
                    if (isView) {
                        form.addButton({
                            id: 'custpage_btn_edit',
                            label: '✏️ Edit',
                            functionName: 'redirectToEditor()'
                        });
                        form.addButton({
                            id: 'custpage_btn_copy',
                            label: '📋 Copy',
                            functionName: 'redirectToCopy()'
                        });
                        form.addButton({
                            id: 'custpage_btn_pdf',
                            label: '📄 PDF',
                            functionName: 'showPDF()'
                        });
                        const pairedTransaction = invoiceRec.getValue({ fieldId: 'custrecord_dxso_pairedtransaction' });
                        const status = invoiceRec.getValue({ fieldId: 'custrecord_dxso_status' });
                        if (!pairedTransaction && status !== STATUS.PROCESSED) {
                            form.addButton({
                                id: 'custpage_btn_process',
                                label: '🚀 Process',
                                functionName: 'ProcessSingleRecord()'
                            });
                        }

                        form.addButton({
                            id: 'custpage_btn_org_rec',
                            label: '🗂️ Original Record',
                            functionName: 'redirectToOriginalRecord()'
                        });
                    }
                    if (!isView) {
                        if (isNew) {
                            form.addButton({
                                id: 'custpage_btn_cancel',
                                label: '🔙 Back to List',
                                functionName: 'cancelNewAndRedirect()'
                            });
                        } else {
                            form.addButton({
                                id: 'custpage_btn_cancel',
                                label: '↩️ Cancel',
                                functionName: 'cancelAndRedirect()'
                            });
                        }
                    }


                } catch (e) {
                    form.addField({ id: 'custpage_error', type: ui.FieldType.INLINEHTML, label: 'Error' })
                        .defaultValue = `<div style="color:red;">Error loading invoice: ${e.message}</div>`;
                }

                context.response.writePage(form);
            }

            if (context.request.method === 'POST') {
                const invoiceId = context.request.parameters.custpage_invoiceid;
                const mode = (context.request.parameters.custparam_mode || context.request.parameters['custpage_custparam_mode'] || 'view').toLowerCase();
                if (['edit','new','copy','delete'].includes(mode) && !isEditRole()) {
                    denyAccess(context.response);
                    return;
                }

                let rec;
                const isCopyMode = mode === 'copy';
                const isNewOrCopy =  mode === 'new' || isCopyMode;

                log.debug('POST Submit', {
                    invoiceId,
                    mode,
                    isNewOrCopy,
                    isCopyMode
                });



                if (isNewOrCopy) {
                    rec = record.create({ type: CUSTOM_RECORD_ID });
                } else {
                    rec = record.load({ type: CUSTOM_RECORD_ID, id: invoiceId });
                }

                log.debug('Loaded invoice', { id: invoiceId });


                FIELD_DEFS.forEach(field => {
                    const paramVal = context.request.parameters['custpage_' + field.id];
                    if (paramVal !== undefined && paramVal !== null) {
                        if (field.type === ui.FieldType.DATE) {
                            const parsedDate = parseDateWithFormat(paramVal);
                            rec.setValue({ fieldId: field.id, value: parsedDate });
                        }else {
                            rec.setValue({fieldId: field.id, value: paramVal});
                        }
                    }
                });

                // FIELD_DEFS.forEach(field => {
                //     const val = rec.getValue({fieldId: field.id});
                //     // log.debug(`Saving field ${field.id}`, val);
                // })
                rec.setValue({
                    fieldId: 'custrecord_dxso_status',
                    value: STATUS.EDITED
                });

                if (mode === 'new' || isCopyMode) {
                    let nameVal = rec.getValue({ fieldId: 'name' }) || '';
                    if (!/-[0-9a-z]{8}$/i.test(nameVal)) {
                        rec.setValue({ fieldId: 'name', value: withTs8(nameVal) });
                    }
                }

                const recId = rec.save();

                const parentId = isNewOrCopy ? recId : invoiceId;

                log.debug('Saved record', {
                    recId,
                    parentId,
                    isNewOrCopy,
                    invoiceIdFromRequest: invoiceId
                });

                let existingLineIds = [];

                if (!isNewOrCopy) {
                    existingLineIds = search.create({
                        type: CUSTOM_ITEM_LINE_ID,
                        filters: [[PARENT_FIELD_ID, 'is', invoiceId]],
                        columns: ['internalid']
                    }).run().getRange({ start: 0, end: 1000 }).map(r => r.getValue('internalid'));
                }

                log.debug('Existing line IDs', existingLineIds);


                const keptLineIds = [];
                const lineCount = context.request.getLineCount({ group: ITEM_SUBLIST_DEFS.id });

                for (let i = 0; i < lineCount; i++) {
                    const lineId = context.request.getSublistValue({
                        group: ITEM_SUBLIST_DEFS.id,
                        name: 'line_id',
                        line: i
                    });

                    const values = {};
                    ITEM_SUBLIST_DEFS.fields.forEach(field => {
                        if (field.id === 'tax_rate') {
                            const rateStr = context.request.getSublistValue({
                                group: ITEM_SUBLIST_DEFS.id,
                                name: 'tax_rate',
                                line: i
                            }) || '0%';

                            const taxRateDecimal = parseFloat(rateStr.replace('%', '').trim()) || 0;
                            values[field.sourceRecordField] = taxRateDecimal;
                            return;
                        }

                        const val = context.request.getSublistValue({
                            group: ITEM_SUBLIST_DEFS.id,
                            name: field.id,
                            line: i
                        });
                        values[field.sourceRecordField] = val;
                    });


                    log.debug(`Line ${i} data`, { lineId, values });


                    let lineRec;
                    if (isCopyMode && lineId) {
                        // 🔹 Copy mode: clone line and reset parent + name
                        lineRec = record.copy({ type: CUSTOM_ITEM_LINE_ID, id: lineId });
                        lineRec.setValue({ fieldId: PARENT_FIELD_ID, value: parentId });
                        const externalId = 'manual_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
                        lineRec.setValue({ fieldId: 'name', value: externalId });
                        log.debug('Copying line', { fromLineId: lineId, newExternalId: externalId });

                    } else if (lineId) {
                        // 🔹 Normal update
                        keptLineIds.push(lineId);
                        lineRec = record.load({ type: CUSTOM_ITEM_LINE_ID, id: lineId });
                    } else {
                        // 🔹 New line
                        lineRec = record.create({ type: CUSTOM_ITEM_LINE_ID });
                        lineRec.setValue({ fieldId: PARENT_FIELD_ID, value: parentId });
                        const externalId = 'manual_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
                        lineRec.setValue({ fieldId: 'name', value: externalId });
                        log.debug('Creating new line', { externalId });
                    }


                    Object.entries(values).forEach(([fid, val]) => {
                        if (fid && val !== undefined) {
                            lineRec.setValue({ fieldId: fid, value: val });
                        }
                    });

                    const savedId = lineRec.save();
                    log.debug(`Saved line record`, { id: savedId });                }

                if (!isNewOrCopy) {
                    const toDelete = existingLineIds.filter(id => !keptLineIds.includes(id));
                    toDelete.forEach(id => {
                        record.delete({ type: CUSTOM_ITEM_LINE_ID, id });
                        log.debug(`Deleted line`, id);
                    });
                }

                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        custparam_mode: 'view',
                        custparam_invoiceid: recId
                    }
                });

                return;
            }

        }

        function isMapReduceRunning(scriptId, deploymentId) {
            const mrStatusSearch = search.create({
                type: 'scheduledscriptinstance',
                filters: [
                    ['script.scriptid', 'is', scriptId],
                    'AND',
                    ['scriptdeployment.scriptid', 'is', deploymentId],
                    'AND',
                    ['status', 'anyof', 'PROCESSING', 'RECEIVED']
                ],
                columns: ['status']
            });

            const results = mrStatusSearch.run().getRange({ start: 0, end: 1 });
            return results.length > 0;
        }



        function handleProcessSingleRecord(request, response) {
            const draftId = request.parameters.custparam_invoiceid;
            if (!draftId) {
                return showErrorForm(response, 'Missing draft ID.');
            }

            if (isMapReduceRunning(MR_SCRIPT_ID, MR_DEPLOYMENT_ID)) {
                return showErrorForm(request, response, 'Map Reduce Script is already running. Please try again later.');
            }

            try {
                // Vytvorenie process recordu
                const processRec = record.create({
                    type: 'customrecord_dxso_tran_create_process',
                    isDynamic: true
                });

                const currentUserId = runtime.getCurrentUser().id;

                processRec.setValue({ fieldId: 'custrecord_dxso_triggered', value: currentUserId });
                processRec.setValue({ fieldId: 'custrecord_dxso_proc_status', value: '1' }); // Initiated
                processRec.setValue({ fieldId: 'custrecord_dxso_parameters', value: JSON.stringify([draftId]) });
                processRec.setValue({ fieldId: 'custrecord_dxso_processed', value: "0/1" });
                processRec.setValue({
                    fieldId: 'name',
                    value: 'DXSO Single Process – ' + new Date().toISOString()
                });

                const processId = processRec.save();

                // Spustenie MR skriptu
                const mapReduceTask = task.create({ taskType: task.TaskType.MAP_REDUCE });
                mapReduceTask.scriptId = MR_SCRIPT_ID;
                mapReduceTask.deploymentId = MR_DEPLOYMENT_ID;
                mapReduceTask.params = {
                    custscript_input_transaction_ids: draftId,
                    custscript_dxso_process_record: processId
                };

                mapReduceTask.submit();

                // Redirect na status stránku
                redirect.toSuitelet({
                    scriptId: 'customscript_00_dxso_status_sl',
                    deploymentId: 'customdeploy_00_dxso_status_sl',
                    parameters: { custparam_pid: processId }
                });

            } catch (e) {
                log.error({
                    title: '❌ MR Submit Failed',
                    details: JSON.stringify(e, Object.getOwnPropertyNames(e))
                });

                return showErrorForm(request, response, 'Failed to start background process. Please contact the ERP team.');
            }
        }


        function showErrorForm(request, response, messageHtml) {
            const draftId = request?.parameters?.custparam_invoiceid;

            const form = ui.createForm({ title: 'DXSO Process Error' });

            form.addField({
                id: 'custpage_invoiceid',
                label: 'Invoice ID',
                type: ui.FieldType.TEXT
            }).updateDisplayType({
                displayType: ui.FieldDisplayType.HIDDEN
            }).defaultValue = draftId;

            const errorField = form.addField({
                id: 'custpage_error_inline',
                type: ui.FieldType.INLINEHTML,
                label: ' '
            });

            const backUrl = draftId
                ? `/app/site/hosting/scriptlet.nl?script=${SL_SCRIPT_ID}&deploy=${SL_DEP_ID}&custparam_invoiceid=${draftId}`
                : null;

            const buttonHtml = backUrl
                ? `<button onclick="window.location.href='${backUrl}'" style="padding:6px 12px; background-color:#007bff; color:white; border:none; border-radius:4px; cursor:pointer;">
                ← Back to Draft
            </button>`
                : `<button onclick="history.back()" style="padding:6px 12px; background-color:#007bff; color:white; border:none; border-radius:4px; cursor:pointer;">
                ← Go Back
            </button>`;

            errorField.defaultValue = `
                <div style="color:#100753; font-size:14px; padding:10px;">
                    <strong>⚠️ Error:</strong> ${messageHtml}
                </div>
                <br>
                ${buttonHtml}
            `;

            response.writePage(form);
        }

        function parseDateWithFormat(str) {
            if (!str || typeof str !== 'string') return null;

            const userPref = runtime.getCurrentUser().getPreference({ name: 'DATEFORMAT' });

            const parts = str.split(/[\/.-]/);
            if (parts.length !== 3) return null;

            let day, month, year;

            switch (userPref) {

                case 'DD/MM/YYYY':
                    [day, month, year] = parts;
                    break;
                case 'M/D/YYYY':
                case 'MM/DD/YYYY':
                    [month, day, year] = parts;
                    break;
                case 'YYYY/MM/DD':
                case 'YYYY-MM-DD':
                    [year, month, day] = parts;
                    break;
                default:
                    // fallback: assume ISO
                    [year, month, day] = parts;
            }

            // return new Date(`${year}-${month}-${day}`);
             return new Date(`${year}-${month}-${day}T12:00:00`);
        }

        function safeSet(sublist, id, line, value) {
            if (value === undefined || value === null) return;
            if (typeof value === 'number') {
                sublist.setSublistValue({ id, line, value });
                return;
            }
            if (typeof value === 'string') {
                const clean = value.trim();
                if (clean !== '') sublist.setSublistValue({ id, line, value: clean });
                return;
            }
            sublist.setSublistValue({ id, line, value: String(value) });
        }

        function populateSublist(sublist, results, defs, isView) {
            for (let i = 0; i < results.length; i++) {
                const res = results[i];

                defs.fields.forEach(field => {
                    if (!field.sourceRecordField) return;

                    let value;

                    if (isView && field.source) {
                        value = res.getText({ name: field.sourceRecordField }) || '';
                    } else {
                        value = res.getValue({ name: field.sourceRecordField }) || '';
                    }

                    safeSet(sublist, field.id, i, value);
                });
            }
        }


        function addFieldDynamic(form, record, fieldDef, isView, mode) {
            const fieldId = fieldDef.id;
            const internalId = 'custpage_' + fieldId;

            let field;

            if (fieldDef.type === ui.FieldType.SELECT) {
                if (Array.isArray(fieldDef.options)) {
                    field = form.addField({
                        id: internalId,
                        label: fieldDef.label,
                        type: fieldDef.type,
                        container: fieldDef.section
                    });
                    field.addSelectOption({ value: '', text: '' });
                    fieldDef.options.forEach(opt => {
                        field.addSelectOption({ value: opt.value, text: opt.text });
                    });
                } else {
                    field = form.addField({
                        id: internalId,
                        label: fieldDef.label,
                        type: fieldDef.type,
                        source: fieldDef.source,
                        container: fieldDef.section
                    });
                }
            } else {
                field = form.addField({
                    id: internalId,
                    label: fieldDef.label,
                    type: fieldDef.type,
                    container: fieldDef.section
                });
            }

            if (isView) {
                field.updateDisplayType({ displayType: ui.FieldDisplayType.INLINE });
            } else if (fieldDef.displayType && mode === 'edit') {
                field.updateDisplayType({ displayType: fieldDef.displayType });
            }

            // new or copy disabled fields
            if ((mode === 'new' || mode === 'copy') &&
                (fieldId === 'custrecord_dxso_billaddress' || fieldId === 'custrecord_dxso_account')) {
                field.updateDisplayType({ displayType: ui.FieldDisplayType.DISABLED });
            }


            if (fieldDef.breakType) {
                field.updateBreakType({ breakType: fieldDef.breakType });
            }

            if (fieldDef.mandatory) {
                field.isMandatory = true;
            }

            const val = record.getValue({ fieldId });
            if (fieldDef.defaultOverride !== undefined) {
                field.defaultValue = String(fieldDef.defaultOverride);
            } else if (fieldDef.type === ui.FieldType.DATE && val instanceof Date) {
                field.defaultValue = val;
            } else if (val !== null && val !== undefined) {
                field.defaultValue = String(val);
            }
        }

        function deleteInvoiceWithLines(invoiceId, context) {
            const childLines = search.create({
                type: CUSTOM_ITEM_LINE_ID,
                filters: [[PARENT_FIELD_ID, 'is', invoiceId]],
                columns: ['internalid']
            }).run().getRange({ start: 0, end: 1000 });

            for (const line of childLines) {
                const lineId = line.getValue('internalid');
                record.delete({ type: CUSTOM_ITEM_LINE_ID, id: lineId });
            }

            record.delete({ type: CUSTOM_RECORD_ID, id: invoiceId });

            context.response.write(`
                <h2>Record Deleted</h2>
                <p>The transaction and its item lines have been deleted.</p>
                <a href="/app/common/custom/custrecordentrylist.nl?rectype=${CUSTOM_RECORD_ID_LIST}">Return to List</a>
            `);
        }

        function withTs8(value) {
            const ts8 = Date.now().toString(36).slice(-8).padStart(8, '0');
            const v = (value ?? '').toString();
            return v ? `${v}-${ts8}` : ts8; // ak je value prázdne, vráti len timestamp
        }

        /** Parse roles from deployment/script parameter.
         *  Supports CSV ("3,1022") and JSON array (["3","1022"]).
         */
        function getEditRolesArray() {
            const raw = runtime.getCurrentScript().getParameter({ name: EDIT_ROLES_PARAM }) || '';
            const text = String(raw).trim();
            if (!text) return [];
            // Try JSON array first
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean);
            } catch (e) { /* not JSON, continue */ }
            // Fallback: CSV (also tolerates whitespace)
            return text.split(',').map(s => s.trim()).filter(Boolean);
        }

        /** Fast membership check using Set */
        function isEditRole() {
            const currentRole = String(runtime.getCurrentUser().role);
            const roleSet = new Set(getEditRolesArray());
            return roleSet.has(currentRole);
        }

        /** Write a minimal, system-like 403 page and stop. */
        function denyAccess(response) {
            const form = ui.createForm({ title: 'Access Denied' });
            form.addField({
                id: 'custpage_perm_denied',
                type: ui.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue = (
                '<div style="margin:16px 0;padding:12px;border:1px solid #ddd;' +
                'background:#fafafa;border-radius:6px;font-family:Arial, sans-serif;">' +
                '<div style="font-weight:600;margin-bottom:4px;">403 – Forbidden</div>' +
                '<div>You do not have permission to view this page.</div>' +
                '</div>'
            );
            response.writePage(form);
        }

        // /**
        //  * Loads fields from an Item record by internal ID and returns an object with values.
        //  * @param {string|number} itemId - Internal ID of the Item record
        //  * @param {string[]} fieldIds - Array of field IDs to retrieve from the Item
        //  * @returns {Object<string, any>} - Object containing field values keyed by field ID
        //  */
        // function loadItemFields(itemId, fieldIds) {
        //     try {
        //         const result = search.lookupFields({
        //             type: search.Type.ITEM,
        //             id: itemId,
        //             columns: fieldIds
        //         });
        //
        //         const values = {};
        //         for (const fieldId of fieldIds) {
        //             const val = result[fieldId];
        //             if (Array.isArray(val)) {
        //                 values[fieldId] = val.length > 0 ? val[0].value : null;
        //             } else {
        //                 values[fieldId] = val;
        //             }
        //         }
        //         log.debug('loadItemFields: ', values);
        //
        //         return values;
        //     } catch (e) {
        //         log.error('loadItemFields failed', e.message);
        //         return {};
        //     }
        // }


        return { onRequest };
    });

